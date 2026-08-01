import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));

  // API Endpoint to save user customization directly into src/data/defaultCard.ts for Vercel/production deployment
  app.post('/api/save-default-card', (req, res) => {
    try {
      const cardData = req.body;
      if (!cardData || typeof cardData !== 'object') {
        return res.status(400).json({ success: false, error: 'Données de carte invalides' });
      }

      const filePath = path.join(process.cwd(), 'src', 'data', 'defaultCard.ts');
      const fileContent = `import { CardData } from '../types';\n\nexport const defaultCardData: CardData = ${JSON.stringify(cardData, null, 2)};\n`;

      fs.writeFileSync(filePath, fileContent, 'utf-8');
      console.log('Saved custom card data to src/data/defaultCard.ts');
      return res.json({ success: true });
    } catch (err) {
      console.error('Failed to save default card data:', err);
      return res.status(500).json({ success: false, error: 'Erreur lors de la sauvegarde sur disque' });
    }
  });

  // Initialize Gemini AI SDK (Server-Side Only)
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Endpoint for generating romantic love letters using Gemini
  app.post('/api/generate-letter', async (req, res) => {
    try {
      const { recipientName = 'Mon Amour', occasion = 'Anniversaire', tone = 'Romantique & Émouvant', keyMemories = '' } = req.body;

      const prompt = `Rédige une magnifique lettre d'amour très touchante, romantique et personnalisée pour ma copine.
Nom de la copine: ${recipientName}
Occasion: ${occasion}
Style / Ton: ${tone}
Souvenirs / Détails spécifiques: ${keyMemories || 'Nos rires, nos voyages, sa douceur, sa beauté, nos moments simples.'}

Exigences de style:
- Rédige en Français (ou bilingue si approprié).
- La lettre doit être poétique, sincère et pleine d'émotion profonde.
- Structure en 3 ou 4 courts paragraphes faciles à lire.
- Termine par une belle formule d'amour (ex: "Je t'aime pour toujours", "À toi pour l'éternité").

Réponds sous la forme JSON stricte suivante:
{
  "salutation": "Chère ${recipientName},",
  "letterContent": "Le corps du texte de la lettre..."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);

      res.json({
        success: true,
        salutation: parsed.salutation || `Chère ${recipientName},`,
        letterContent: parsed.letterContent || text,
      });
    } catch (error) {
      console.error('Error generating letter:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la génération de la lettre. Veuillez réessayer.',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
