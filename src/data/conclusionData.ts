export type SnapshotStageId = 'jan-30' | 'mar-23' | 'jul-20';

export type SnapshotStatus = 'intact' | 'attacked' | 'controlled';

export interface SnapshotDomainCard {
  id: string;
  domain: string;
  status: SnapshotStatus;
  statusLabel: string;
  visualSummary: string;
  eventId: string;
  eventDateLabel: string;
}

export interface SnapshotStage {
  id: SnapshotStageId;
  dateLabel: string;
  shortLabel: string;
  headline: string;
  takeaway: string;
  cards: SnapshotDomainCard[];
}

export const SNAPSHOT_STAGES: SnapshotStage[] = [
  {
    id: 'jan-30',
    dateLabel: '30. Januar 1933',
    shortLabel: '30. Jan',
    headline: 'Ausgangslage: Koalitionsregierung in einer noch bestehenden Republik',
    takeaway:
      'Hitler ist Reichskanzler, doch Verfassung, Parteien, Gewerkschaften und Grundrechte bestehen formal noch.',
    cards: [
      {
        id: 'grundrechte',
        domain: 'Grundrechte & Presse',
        status: 'intact',
        statusLabel: 'Garantiert',
        visualSummary:
          'Meinungs-, Presse- und Versammlungsfreiheit gelten verfassungsrechtlich noch.',
        eventId: 'ernennung-hitler',
        eventDateLabel: '30. Jan 1933',
      },
      {
        id: 'parlament',
        domain: 'Reichstag & Gesetze',
        status: 'intact',
        statusLabel: 'Gewählt',
        visualSummary:
          'Gesetze bedürfen noch des Reichstags; nur 3 von 11 Ministern gehören zur NSDAP.',
        eventId: 'ernennung-hitler',
        eventDateLabel: '30. Jan 1933',
      },
      {
        id: 'gewalt',
        domain: 'Polizei, SA & Terror',
        status: 'attacked',
        statusLabel: 'Druck wächst',
        visualSummary:
          'Göring übernimmt die Polizeiführung in Preußen; SA-Straßenaufmärsche nehmen zu.',
        eventId: 'ernennung-hitler',
        eventDateLabel: '30. Jan 1933',
      },
      {
        id: 'organisationen',
        domain: 'Parteien & Gewerkschaften',
        status: 'intact',
        statusLabel: 'Eigenständig',
        visualSummary:
          'SPD, KPD, Zentrum und freie Gewerkschaften arbeiten noch legal.',
        eventId: 'ernennung-hitler',
        eventDateLabel: '30. Jan 1933',
      },
      {
        id: 'laender-kultur',
        domain: 'Länder & Kultur',
        status: 'intact',
        statusLabel: 'Föderal',
        visualSummary:
          'Länder besitzen eigene Parlamente; Wissenschaft, Kunst und Literatur sind noch pluralistisch.',
        eventId: 'ernennung-hitler',
        eventDateLabel: '30. Jan 1933',
      },
    ],
  },
  {
    id: 'mar-23',
    dateLabel: '23. März 1933',
    shortLabel: '23. Mär',
    headline: 'Wendepunkt: Ausnahmezustand, KZ-Terror und Selbstentmachtung',
    takeaway:
      'Nach Reichstagsbrand und Ermächtigungsgesetz regiert die NS-Führung ohne Verfassungsschranken.',
    cards: [
      {
        id: 'grundrechte',
        domain: 'Grundrechte & Presse',
        status: 'controlled',
        statusLabel: 'Ausgesetzt',
        visualSummary:
          'Die Reichstagsbrandverordnung hebt Freiheitsrechte auf unbestimmte Zeit auf.',
        eventId: 'reichstagsbrandverordnung',
        eventDateLabel: '28. Feb 1933',
      },
      {
        id: 'parlament',
        domain: 'Reichstag & Gesetze',
        status: 'controlled',
        statusLabel: 'Entmachtet',
        visualSummary:
          'Mit dem Ermächtigungsgesetz darf die Regierung Gesetze ohne Reichstag beschließen.',
        eventId: 'ermaechtigungsgesetz',
        eventDateLabel: '23. Mär 1933',
      },
      {
        id: 'gewalt',
        domain: 'Polizei, SA & Terror',
        status: 'controlled',
        statusLabel: 'Entfesselt',
        visualSummary:
          'SA/SS handeln als Hilfspolizei; in Dachau beginnt das Konzentrationslagersystem.',
        eventId: 'kz-dachau',
        eventDateLabel: '22. Mär 1933',
      },
      {
        id: 'organisationen',
        domain: 'Parteien & Gewerkschaften',
        status: 'attacked',
        statusLabel: 'Verfolgt',
        visualSummary:
          'KPD-Mandate werden annulliert, SPD-Abgeordnete verhaftet; nur die SPD stimmt mit Nein.',
        eventId: 'ermaechtigungsgesetz',
        eventDateLabel: '23. Mär 1933',
      },
      {
        id: 'laender-kultur',
        domain: 'Länder & Kultur',
        status: 'attacked',
        statusLabel: 'Im Umbruch',
        visualSummary:
          'Der „Tag von Potsdam“ bindet konservative Eliten; der Zugriff auf die Länder steht bevor.',
        eventId: 'tag-von-potsdam',
        eventDateLabel: '21. Mär 1933',
      },
    ],
  },
  {
    id: 'jul-20',
    dateLabel: '20. Juli 1933',
    shortLabel: '20. Jul',
    headline: 'Sicherung: NSDAP-Einparteienstaat ohne demokratische Gegenmacht',
    takeaway:
      'In weniger als sechs Monaten sind Staat, Länder, Arbeiterschaft und Öffentlichkeit vollständig gleichgeschaltet.',
    cards: [
      {
        id: 'grundrechte',
        domain: 'Grundrechte & Presse',
        status: 'controlled',
        statusLabel: 'Zerstört',
        visualSummary:
          'Notverordnung gilt dauerhaft; kritische Zeitungen sind verboten oder gleichgeschaltet.',
        eventId: 'reichstagsbrandverordnung',
        eventDateLabel: '28. Feb 1933',
      },
      {
        id: 'parlament',
        domain: 'Reichstag & Gesetze',
        status: 'controlled',
        statusLabel: 'Ausgeschaltet',
        visualSummary:
          'Gewaltenteilung ist aufgehoben; Hitler regiert per Regierungsgesetz ohne Opposition.',
        eventId: 'einparteienstaat-gesetz',
        eventDateLabel: '14. Jul 1933',
      },
      {
        id: 'gewalt',
        domain: 'Polizei, SA & Terror',
        status: 'controlled',
        statusLabel: 'Systematisch',
        visualSummary:
          '„Schutzhaft“ ohne Gerichtsurteil, KZ Dachau und gesäuberte Verwaltung sichern Kontrolle.',
        eventId: 'berufsbeamtentum',
        eventDateLabel: '07. Apr 1933',
      },
      {
        id: 'organisationen',
        domain: 'Parteien & Gewerkschaften',
        status: 'controlled',
        statusLabel: 'Zerschlagen',
        visualSummary:
          'Gewerkschaften ersetzt durch die DAF; SPD verboten; NSDAP gesetzlich einzige Partei.',
        eventId: 'einparteienstaat-gesetz',
        eventDateLabel: '14. Jul 1933',
      },
      {
        id: 'laender-kultur',
        domain: 'Länder & Kultur',
        status: 'controlled',
        statusLabel: 'Gleichgeschaltet',
        visualSummary:
          'Reichsstatthalter lenken Länder; Bücherverbrennungen & Reichskonkordat festigen das System.',
        eventId: 'reichskonkordat',
        eventDateLabel: '20. Jul 1933',
      },
    ],
  },
];

export interface PowerPillar {
  id: 'staat-recht' | 'terror-verfolgung' | 'gesellschaft-propaganda';
  numberLabel: string;
  title: string;
  subtitle: string;
  explanation: string;
  linkedEvents: { eventId: string; dateLabel: string; label: string }[];
}

export const POWER_PILLARS: PowerPillar[] = [
  {
    id: 'staat-recht',
    numberLabel: '01',
    title: 'Staat & Recht',
    subtitle: 'Scheinlegalität als Hebel',
    explanation:
      'Gesetze und Notverordnungen gaben dem Machtausbau einen rechtlichen Anschein. So wurden Grundrechte, Parlament und Föderalismus Schritt für Schritt mit formalen Mitteln abgeschafft.',
    linkedEvents: [
      {
        eventId: 'reichstagsbrandverordnung',
        dateLabel: '28. Feb',
        label: 'Reichstagsbrandverordnung',
      },
      {
        eventId: 'ermaechtigungsgesetz',
        dateLabel: '23. Mär',
        label: 'Ermächtigungsgesetz',
      },
      {
        eventId: 'einparteienstaat-gesetz',
        dateLabel: '14. Jul',
        label: 'Einparteienstaat',
      },
    ],
  },
  {
    id: 'terror-verfolgung',
    numberLabel: '02',
    title: 'Terror & Gewalt',
    subtitle: 'Einschüchterung auf der Straße',
    explanation:
      'SA und SS erhielten staatliche Polizeigewalt, schüchterten Wähler und Abgeordnete ein und verschleppten politische Gegner ohne Gerichtsverfahren in frühe Konzentrationslager.',
    linkedEvents: [
      {
        eventId: 'sa-ss-hilfspolizei',
        dateLabel: '22. Feb',
        label: 'SA/SS als Hilfspolizei',
      },
      {
        eventId: 'kz-dachau',
        dateLabel: '22. Mär',
        label: 'KZ Dachau',
      },
      {
        eventId: 'verbot-spd',
        dateLabel: '22. Jun',
        label: 'Verbot der SPD',
      },
    ],
  },
  {
    id: 'gesellschaft-propaganda',
    numberLabel: '03',
    title: 'Gesellschaft & Propaganda',
    subtitle: 'Täuschung und Zustimmung',
    explanation:
      'Durch Inszenierungen wie den „Tag von Potsdam“ oder den 1. Mai gewann das Regime Vertrauen oder täuschte Gegner – direkt gefolgt von Gleichschaltung, DAF und Bücherverbrennung.',
    linkedEvents: [
      {
        eventId: 'tag-von-potsdam',
        dateLabel: '21. Mär',
        label: 'Tag von Potsdam',
      },
      {
        eventId: 'tag-der-nationalen-arbeit',
        dateLabel: '01. Mai',
        label: 'Tag der nationalen Arbeit',
      },
      {
        eventId: 'buecherverbrennungen',
        dateLabel: '10. Mai',
        label: 'Bücherverbrennungen',
      },
    ],
  },
];

export interface GlossaryTerm {
  id: string;
  term: string;
  shortTag: string;
  definition: string;
  eventId: string;
  eventLabel: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'art-48',
    term: 'Art. 48 WRV',
    shortTag: 'Notverordnungen',
    definition:
      'Artikel 48 der Weimarer Reichsverfassung erlaubte dem Reichspräsidenten im Notfall Notverordnungen und die Aussetzung von Grundrechten – 1933 dauerhaft missbraucht.',
    eventId: 'reichstagsbrandverordnung',
    eventLabel: '28. Feb 1933',
  },
  {
    id: 'scheinlegalitaet',
    term: 'Scheinlegalität',
    shortTag: 'Taktik der NSDAP',
    definition:
      'Vorgehen, bei dem die Diktatur über formale Ernennungen, Abstimmungen und Gesetze errichtet wird, während gleichzeitig Terror und Einschüchterung freie Entscheidungen verhindern.',
    eventId: 'ermaechtigungsgesetz',
    eventLabel: '23. Mär 1933',
  },
  {
    id: 'schutzhaft',
    term: '„Schutzhaft“',
    shortTag: 'Willkürliche Haft',
    definition:
      'Festnahme politischer Gegner durch Polizei, SA oder SS ohne richterlichen Haftbefehl und ohne zeitliche Begrenzung – Grundlage für das KZ-System.',
    eventId: 'kz-dachau',
    eventLabel: '22. Mär 1933',
  },
  {
    id: 'gleichschaltung',
    term: 'Gleichschaltung',
    shortTag: 'Umbau von Staat & Kultur',
    definition:
      'Unterordnung aller staatlichen und gesellschaftlichen Bereiche (Länder, Verwaltung, Gewerkschaften, Kultur) unter Führung und Ideologie der NSDAP.',
    eventId: 'gleichschaltung-laender-2',
    eventLabel: '07. Apr 1933',
  },
  {
    id: 'einparteienstaat',
    term: 'Einparteienstaat',
    shortTag: 'Monopol der NSDAP',
    definition:
      'Politisches System ohne Pluralismus und Opposition: Ab 14. Juli 1933 war allein die NSDAP als Partei gesetzlich zugelassen.',
    eventId: 'einparteienstaat-gesetz',
    eventLabel: '14. Jul 1933',
  },
];

export interface CheckQuestion {
  id: string;
  prompt: string;
  mode: 'single' | 'multi';
  options: { id: string; label: string }[];
  correctOptionIds: string[];
  explanation: string;
  referenceEventId: string;
  referenceLabel: string;
}

export const CHECK_QUESTIONS: CheckQuestion[] = [
  {
    id: 'q1-scheinlegalitaet',
    prompt:
      'Warum war das Ermächtigungsgesetz (23. März 1933) für Hitler ein so entscheidender Schritt?',
    mode: 'single',
    options: [
      {
        id: 'a',
        label: 'Erst danach durfte die Regierung Gesetze dauerhaft ohne Reichstag beschließen.',
      },
      {
        id: 'b',
        label: 'Es machte Hitler erstmals überhaupt zum Reichskanzler.',
      },
      {
        id: 'c',
        label: 'Es verbot bereits am selben Tag alle anderen politischen Parteien.',
      },
    ],
    correctOptionIds: ['a'],
    explanation:
      'Die Reichstagsbrandverordnung setzte zwar Grundrechte außer Kraft, doch erst das Ermächtigungsgesetz übertrug die gesamte Gesetzgebung auf die Regierung – ohne parlamentarische Kontrolle.',
    referenceEventId: 'ermaechtigungsgesetz',
    referenceLabel: '23. Mär · Ermächtigungsgesetz',
  },
  {
    id: 'q2-wahl-5-maerz',
    prompt:
      'Was zeigte die Reichstagswahl am 5. März 1933 trotz massivem Terror von SA und SS?',
    mode: 'single',
    options: [
      {
        id: 'a',
        label: 'Die NSDAP gewann über 60 % der Stimmen allein.',
      },
      {
        id: 'b',
        label: 'Die NSDAP verfehlte mit 43,9 % die absolute Mehrheit und brauchte die DNVP.',
      },
      {
        id: 'c',
        label: 'SPD und KPD boykottierten die Wahl vollständig.',
      },
    ],
    correctOptionIds: ['b'],
    explanation:
      'Selbst bei eingeschränkter Pressefreiheit und Gewalt erreichte die NSDAP nur 43,9 %. Erst im Bündnis mit der konservativen DNVP kam eine Mehrheit zustande.',
    referenceEventId: 'reichstagswahl-1933',
    referenceLabel: '05. Mär · Reichstagswahl',
  },
  {
    id: 'q3-zusammenspiel',
    prompt:
      'Welche drei Mittel griffen bei der Sicherung der NS-Diktatur zwischen Januar und Juli 1933 ineinander? (Mehrfachauswahl)',
    mode: 'multi',
    options: [
      {
        id: 'a',
        label: 'Rechtliche Hebel wie Notverordnungen und Gleichschaltungsgesetze',
      },
      {
        id: 'b',
        label: 'Offene Gewalt und Einschüchterung durch Hilfspolizei und KZ Dachau',
      },
      {
        id: 'c',
        label: 'Propaganda und Täuschung (z. B. Tag von Potsdam und 1. Mai)',
      },
      {
        id: 'd',
        label: 'Freie Volksabstimmungen über jedes neue Gesetz im gesamten Jahr 1933',
      },
    ],
    correctOptionIds: ['a', 'b', 'c'],
    explanation:
      'Entscheidend war die Kombination aller drei Säulen: Scheinlegale Gesetze, Straßenterror gegen Gegner und gezielte Propaganda zur Einbindung oder Täuschung.',
    referenceEventId: 'tag-von-potsdam',
    referenceLabel: '21. Mär · Tag von Potsdam',
  },
  {
    id: 'q4-mai-taeuschung',
    prompt:
      'Worin bestand die gezielte Täuschung rund um den 1. und 2. Mai 1933?',
    mode: 'single',
    options: [
      {
        id: 'a',
        label: 'Am 1. Mai feierte das Regime die Arbeiter – am 2. Mai zerschlug die SA die Gewerkschaften.',
      },
      {
        id: 'b',
        label: 'Die Gewerkschaften erhielten am 2. Mai mehr Streikrechte durch die DAF.',
      },
      {
        id: 'c',
        label: 'Der 1. Mai wurde abgeschafft und durch Betriebsschließungen ersetzt.',
      },
    ],
    correctOptionIds: ['a'],
    explanation:
      'Mit dem „Tag der nationalen Arbeit“ umwarb die NSDAP die Arbeiterschaft propagandistisch, um am nächsten Morgen die Gewerkschaftshäuser zu besetzen und freie Vertretungen durch die DAF zu ersetzen.',
    referenceEventId: 'zerschlagung-gewerkschaften',
    referenceLabel: '02. Mai · Gewerkschaften',
  },
  {
    id: 'q5-ende-pluralismus',
    prompt:
      'Woran lässt sich erkennen, dass bis Juli 1933 keine legale politische Opposition mehr bestand?',
    mode: 'multi',
    options: [
      {
        id: 'a',
        label: 'Die SPD wurde verboten, bürgerliche Parteien wie das Zentrum lösten sich unter Druck auf.',
      },
      {
        id: 'b',
        label: 'Das Gesetz vom 14. Juli 1933 erklärte die NSDAP zur einzigen politischen Partei.',
      },
      {
        id: 'c',
        label: 'Länderregierungen behielten volle Eigenständigkeit gegenüber Berlin.',
      },
    ],
    correctOptionIds: ['a', 'b'],
    explanation:
      'Nach dem SPD-Verbot und den Selbstauflösungen verbot das Gesetz vom 14. Juli 1933 jede Neubildung von Parteien. Gleichzeitig kontrollierten Reichsstatthalter längst die Länder.',
    referenceEventId: 'einparteienstaat-gesetz',
    referenceLabel: '14. Jul · Einparteienstaat',
  },
];
