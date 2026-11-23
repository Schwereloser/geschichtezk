import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const TIMELINE_REFERENCE = `
THEMA & LEITFRAGE:
"Einrichtung und Sicherung der NS-Diktatur (1933–1934)"
Leitfrage: "Wie gelang es den Nationalsozialisten, die demokratische Ordnung zu beseitigen und ihre Herrschaft dauerhaft zu sichern?"

DREI ZENTRALE SÄULEN DER MACHTSICHERUNG:
1. Staat, Verfassung & Recht ("Scheinlegalität"): Missbrauch formaler Gesetze und Notverordnungen (Art. 48 WRV, Reichstagsbrandverordnung, Ermächtigungsgesetz, Gleichschaltungsgesetze, Einparteienstaat).
2. Terror, Gewalt & Verfolgung: SA/SS als Hilfspolizei, "Schutzhaft" ohne Gerichtsbeschluss, KZ Dachau, Zerschlagung der Gewerkschaften, Parteiverbote, Säuberung der Verwaltung, Morde vom 30. Juni 1934.
3. Gesellschaft, Wirtschaft & Propaganda: Geheimtreffen mit Großindustriellen, Tag von Potsdam, 1. Mai ("Tag der nationalen Arbeit"), Deutsche Arbeitsfront (DAF), Bücherverbrennungen, Reichskonkordat mit dem Vatikan.

CHRONOLOGIE DER 24 STATIONEN (1933–1934):
01 | 30.01.1933 | Ernennung Hitlers zum Reichskanzler (Koalition mit Papen/Hugenberg; nur 3 NSDAP-Minister).
02 | 01.02.1933 | Auflösung des Reichstags durch Hindenburg; Neuwahl für den 5. März angesetzt.
03 | 04.02.1933 | Verordnung zum Schutz des Deutschen Volkes (Einschränkung von Presse- und Versammlungsfreiheit).
04 | 20.02.1933 | Geheimtreffen mit Wirtschaftsvertretern (3 Mio. RM Wahlkampffonds durch Großindustrielle/Schacht/Krupp).
05 | 22.02.1933 | SA und SS werden Hilfspolizei in Preußen (Göring verleiht rund 50.000 NS-Kampfverbandsmännern Polizeigewalt).
06 | 27.02.1933 | Reichstagsbrand (Marinus van der Lubbe festgenommen; Vorwand für angeblichen KPD-Aufstand).
07 | 28.02.1933 | Reichstagsbrandverordnung (Art. 48 WRV: dauerhafte Aussetzung zentraler Grundrechte, Basis für "Schutzhaft").
08 | 05.03.1933 | Reichstagswahl (43,9 % NSDAP trotz Terror; Mehrheit nur mit DNVP "Kampffront Schwarz-Weiß-Rot").
09 | 21.03.1933 | Tag von Potsdam (Garnisonkirche: propagandistische Einheit von Hindenburg/Preußen und Hitler).
10 | 22.03.1933 | Erste Häftlinge im KZ Dachau (Himmler/SS; politisches Vorbild für das KZ-System außerhalb der Justiz).
11 | 23.03.1933 | Ermächtigungsgesetz in der Krolloper (444 Ja : 94 Nein; nur SPD unter Otto Wels stimmt dagegen; KPD ausgeschlossen; Zentrum stimmt nach Zusagen Hitlers zu).
12 | 31.03.1933 | 1. Gesetz zur Gleichschaltung der Länder (Umbildung der Landtage nach Reichstagswahl ohne KPD).
13 | 07.04.1933 | 2. Gesetz zur Gleichschaltung der Länder (Einsetzung von Reichsstatthaltern; Ende des Föderalismus).
14 | 07.04.1933 | Gesetz zur Wiederherstellung des Berufsbeamtentums ("Arierparagraph", Entlassung jüdischer & politischer Gegner).
15 | 08.–18.04.1933 | Konkordatsgespräche im Vatikan (Papen, Prälat Kaas, Kardinalstaatssekretär Pacelli: Schutz gegen Politikverbot für Geistliche).
16 | 01.05.1933 | Tag der nationalen Arbeit (gesetzlicher Feiertag, Großkundgebungen zur Täuschung der Arbeiterschaft).
17 | 02.05.1933 | Zerschlagung der Gewerkschaften (SA und NSBO stürmen Gewerkschaftshäuser, verhaften Funktionäre).
18 | 10.05.1933 | Gründung der Deutschen Arbeitsfront (DAF) unter Robert Ley (Zwangsvereinigung, Abschaffung von Streikrecht & Tarifautonomie).
19 | 10.05.1933 | Bücherverbrennungen auf dem Opernplatz (NS-Studenten verbrennen Werke u. a. von Kästner, Mann, Remarque, Brecht).
20 | 22.06.1933 | Verbot der SPD (Mandate annulliert, Vermögen beschlagnahmt, Exilvorstand Sopade in Prag).
21 | Juni–Juli 1933 | Selbstauflösung anderer Parteien (BVP 4. Juli, Zentrum 5. Juli auch wegen laufender Konkordatsverhandlungen).
22 | 14.07.1933 | Gesetz gegen die Neubildung von Parteien (NSDAP gesetzlich einzige Partei – Einparteienstaat).
23 | 20.07.1933 | Reichskonkordat mit dem Vatikan (erster völkerrechtlicher Vertrag der NS-Regierung; außenpolitische Anerkennung & Art. 32 Politikverbot).
24 | Herbst 1933 – 30.06.1934 | Konkordatsbruch & Druck auf katholische Verbände (Schikanen gegen Jugendverbände/Presse, Morde an Erich Klausener und Adalbert Probst am 30. Juni 1934).
`.trim();

interface ChatMessagePayload {
  role: 'user' | 'assistant';
  text: string;
}

interface FocusedEventPayload {
  indexNumber?: string;
  dateLabel?: string;
  title?: string;
  phaseLabel?: string;
  mechanismLabel?: string;
  summary?: string;
  eventsAndMeasures?: string[];
  contextNotes?: string[];
  institutionNote?: string;
  actors?: { name: string; role?: string; action: string }[];
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function formatFocusedContext(
  focusedEvent: FocusedEventPayload | null | undefined,
  isConclusion: boolean,
  timelineSummary?: string
): string {
  if (isConclusion) {
    return 'AKTUELLE ANSICHT DES NUTZERS: Abschluss- & Bilanzbereich (Vorher/Nachher 1933, 3 Säulen & Fachbegriffe, Ankreuz-Check).';
  }
  if (!focusedEvent?.title) {
    return 'AKTUELLE ANSICHT DES NUTZERS: Gesamtüberblick des Zeitstrahls.';
  }

  const lines = [
    `AKTUELL FOKUSSIERTES EREIGNIS: Station ${focusedEvent.indexNumber ?? ''} — ${focusedEvent.dateLabel ?? ''}: ${focusedEvent.title}`,
  ];
  if (focusedEvent.phaseLabel) lines.push(`Phase: ${focusedEvent.phaseLabel}`);
  if (focusedEvent.mechanismLabel)
    lines.push(`Mechanismus: ${focusedEvent.mechanismLabel}`);
  if (focusedEvent.summary)
    lines.push(`Zusammenfassung: ${focusedEvent.summary}`);
  if (focusedEvent.eventsAndMeasures?.length) {
    lines.push(
      `Maßnahmen: ${focusedEvent.eventsAndMeasures.join(' | ')}`
    );
  }
  if (focusedEvent.actors?.length) {
    lines.push(
      `Akteure: ${focusedEvent.actors
        .map((a) => `${a.name}${a.role ? ` (${a.role})` : ''}: ${a.action}`)
        .join(' | ')}`
    );
  }
  if (focusedEvent.contextNotes?.length) {
    lines.push(`Einordnung: ${focusedEvent.contextNotes.join(' | ')}`);
  }
  if (focusedEvent.institutionNote) {
    lines.push(`Auswirkung auf Institutionen: ${focusedEvent.institutionNote}`);
  }
  if (timelineSummary) {
    lines.push(`Zusatzkontext: ${timelineSummary}`);
  }
  return lines.join('\n');
}

function mapGeminiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  const explicitStatus =
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    typeof (err as { status?: unknown }).status === 'number'
      ? (err as { status: number }).status
      : undefined;
  const statusMatch = raw.match(/\b(400|401|403|404|429|500|502|503)\b/);
  const code = explicitStatus ?? (statusMatch ? Number(statusMatch[1]) : 500);

  if (
    raw.includes('API_KEY_INVALID') ||
    raw.includes('API key not valid') ||
    raw.includes('PERMISSION_DENIED') ||
    code === 401 ||
    code === 403
  ) {
    return {
      status: 403,
      message:
        'Der hinterlegte Gemini-API-Schlüssel ist ungültig oder hat keine Berechtigung. Bitte prüfe die Einstellungen unter Secrets.',
    };
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || code === 429) {
    return {
      status: 429,
      message:
        'Das aktuelle Anfragelimit der KI-API wurde erreicht. Bitte versuche es in einem kurzen Moment erneut.',
    };
  }
  if (raw.includes('NOT_FOUND') || code === 404) {
    return {
      status: 502,
      message:
        'Das angeforderte KI-Modell konnte nicht erreicht werden. Bitte versuche es erneut.',
    };
  }
  if (code === 400 || raw.includes('INVALID_ARGUMENT')) {
    return {
      status: 400,
      message:
        'Die Anfrage an den KI-Dienst konnte in dieser Form nicht verarbeitet werden. Bitte formuliere die Frage etwas kürzer oder starte einen neuen Verlauf.',
    };
  }
  if (
    code === 503 ||
    raw.includes('UNAVAILABLE') ||
    raw.includes('fetch failed') ||
    raw.includes('ENOTFOUND') ||
    raw.includes('ETIMEDOUT')
  ) {
    return {
      status: 502,
      message:
        'Der KI-Dienst ist momentan nicht erreichbar oder überlastet. Bitte versuche es gleich noch einmal.',
    };
  }
  return {
    status: 500,
    message:
      'Die KI-Antwort konnte gerade nicht erstellt werden. Bitte versuche es erneut.',
  };
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/explain', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'Für den KI-Erklärer ist auf dem Server noch kein GEMINI_API_KEY hinterlegt (siehe Einstellungen > Secrets bzw. Umgebungsvariable GEMINI_API_KEY).',
      });
      return;
    }

    const body = req.body as {
      messages?: ChatMessagePayload[];
      focusedEvent?: FocusedEventPayload | null;
      isConclusion?: boolean;
      timelineSummary?: string;
    };

    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const trimmedMessages = messages
      .filter(
        (m): m is ChatMessagePayload =>
          Boolean(m) &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.text === 'string' &&
          m.text.trim().length > 0
      )
      .slice(-14);

    if (trimmedMessages.length === 0) {
      res.status(400).json({ error: 'Bitte gib zuerst eine Frage ein.' });
      return;
    }

    const latestUserMessage = trimmedMessages[trimmedMessages.length - 1];
    if (latestUserMessage.role !== 'user') {
      res.status(400).json({ error: 'Die letzte Nachricht muss eine Frage sein.' });
      return;
    }

    const focusedContext = formatFocusedContext(
      body?.focusedEvent,
      Boolean(body?.isConclusion),
      typeof body?.timelineSummary === 'string' ? body.timelineSummary : undefined
    );

    const systemInstruction = `
Du bist ein präziser, verständlicher Geschichts-Assistent für eine interaktive Pinnwand-Lernanwendung über die „Einrichtung und Sicherung der NS-Diktatur (1933–1934)“.

DEINE AUFGABEN:
- Erkläre historische Ereignisse, Begriffe (z. B. Scheinlegalität, Art. 48 WRV, Schutzhaft, Gleichschaltung, Einparteienstaat, Reichskonkordat), Akteure und Zusammenhänge sachlich, schülergerecht und historisch korrekt auf Deutsch.
- Stelle bei Erklärungen nach Möglichkeit den Bezug zur Leitfrage her („Wie gelang es den Nationalsozialisten, die demokratische Ordnung zu beseitigen und ihre Herrschaft dauerhaft zu sichern?“).
- Nutze den aktuellen Fokus-Kontext des Nutzers, wenn sich die Frage auf „dieses Ereignis“, „das aktuelle Datum“ oder „hier“ bezieht.
- Antworte klar strukturiert, kompakt und gut lesbar (typisch 80–180 Wörter; bei komplexeren Rückfragen etwas ausführlicher, mit kurzen Stichpunkten wo sinnvoll). Vermeide akademisches Kauderwelsch.
- Bleibe strikt bei historisch gesicherten Fakten und verharmlose oder rechtfertige den Nationalsozialismus niemals.

${TIMELINE_REFERENCE}

${focusedContext}
`.trim();

    const history = trimmedMessages.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    try {
      const chat = ai.chats.create({
        model: 'gemini-4-hydrogen',
        ...(history.length > 0 ? { history } : {}),
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const response = await chat.sendMessage({
        message: latestUserMessage.text,
      });

      const replyText = response.text?.trim();
      if (!replyText) {
        res.status(502).json({
          error: 'Die KI hat leider keine Antwort zurückgegeben. Bitte stelle die Frage erneut.',
        });
        return;
      }

      res.json({ reply: replyText });
    } catch (err) {
      const mapped = mapGeminiError(err);
      console.error('Gemini /api/explain error:', err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  if (!IS_PRODUCTION) {
    const hmrDisabled = process.env.DISABLE_HMR === 'true';

    if (hmrDisabled) {
      // Serve a WebSocket-free /@vite/client shim when HMR is disabled so Vite does
      // not attempt to open ws://...:24678 and trigger unhandled WebSocket errors.
      app.get('/@vite/client', (_req: Request, res: Response) => {
        res
          .type('application/javascript')
          .send(
            `const sheetsMap = new Map();
if (typeof document !== 'undefined') {
  document.querySelectorAll('style[data-vite-dev-id]').forEach((el) => {
    sheetsMap.set(el.getAttribute('data-vite-dev-id'), el);
  });
}
export function createHotContext() {
  return {
    data: {},
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    decline() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
  };
}
export function updateStyle(id, content) {
  if (typeof document === 'undefined') return;
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    style.textContent = content;
    document.head.appendChild(style);
    sheetsMap.set(id, style);
  } else if (style.textContent !== content) {
    style.textContent = content;
  }
}
export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style && style.parentNode) {
    style.parentNode.removeChild(style);
    sheetsMap.delete(id);
  }
}
export function injectQuery(url) {
  return url;
}
export class ErrorOverlay {}
`
          );
      });
    }

    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: hmrDisabled ? false : { server: httpServer },
        ...(hmrDisabled ? { ws: false } : {}),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
