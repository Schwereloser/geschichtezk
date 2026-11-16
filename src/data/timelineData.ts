import reichstagImg from '../assets/images/hero_weimar_reichstag_1794822380073.jpg';
import decreeImg from '../assets/images/phase_archival_decree_1794822382633.jpg';
import libraryImg from '../assets/images/phase_memorial_library_1794822382260.jpg';
import parliamentImg from '../assets/images/phase_parliament_chamber_1794822380719.jpg';

export type PhaseId = 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4';

export type MechanismId =
  | 'staat-recht'
  | 'terror-verfolgung'
  | 'gesellschaft-propaganda';

export type InstitutionId =
  | 'grundrechte'
  | 'reichstag'
  | 'regierung'
  | 'laender'
  | 'polizei'
  | 'parteien'
  | 'gewerkschaften'
  | 'kultur'
  | 'kirche';

export type InstitutionStatus = 'normal' | 'attacked' | 'destroyed';

export type NewOrganId =
  | 'hilfspolizei'
  | 'kz-system'
  | 'reichsstatthalter'
  | 'daf'
  | 'einparteienstaat';

export type NewOrganStatus = 'created' | 'active';

export interface InstitutionNode {
  id: InstitutionId;
  label: string;
  shortLabel: string;
}

export interface NewOrganNode {
  id: NewOrganId;
  label: string;
  shortLabel: string;
  foundedLabel: string;
}

export const INSTITUTIONS: InstitutionNode[] = [
  { id: 'grundrechte', label: 'Grundrechte & Presse', shortLabel: 'Grundrechte' },
  { id: 'reichstag', label: 'Reichstag (Parlament)', shortLabel: 'Reichstag' },
  { id: 'regierung', label: 'Reichspräsident & Kabinett', shortLabel: 'Regierung' },
  { id: 'laender', label: 'Länder & Föderalismus', shortLabel: 'Länder' },
  { id: 'polizei', label: 'Polizei & Verwaltung', shortLabel: 'Polizei / Amt' },
  { id: 'parteien', label: 'Parteien & Opposition', shortLabel: 'Parteien' },
  { id: 'gewerkschaften', label: 'Gewerkschaften & Arbeit', shortLabel: 'Gewerkschaften' },
  { id: 'kultur', label: 'Kultur & Wissenschaft', shortLabel: 'Kultur' },
  { id: 'kirche', label: 'Katholische Kirche', shortLabel: 'Kirche' },
];

export const NEW_ORGANS: NewOrganNode[] = [
  {
    id: 'hilfspolizei',
    label: 'NS-Hilfspolizei (SA/SS)',
    shortLabel: 'Hilfspolizei',
    foundedLabel: 'ab 22. Feb',
  },
  {
    id: 'kz-system',
    label: 'KZ-System (Dachau)',
    shortLabel: 'KZ-System',
    foundedLabel: 'ab 22. Mär',
  },
  {
    id: 'reichsstatthalter',
    label: 'Reichsstatthalter',
    shortLabel: 'Statthalter',
    foundedLabel: 'ab 07. Apr',
  },
  {
    id: 'daf',
    label: 'Deutsche Arbeitsfront (DAF)',
    shortLabel: 'DAF',
    foundedLabel: 'ab 10. Mai',
  },
  {
    id: 'einparteienstaat',
    label: 'NSDAP-Einparteienstaat',
    shortLabel: 'Einparteienstaat',
    foundedLabel: 'ab 14. Jul',
  },
];

export interface ActorEntry {
  name: string;
  role?: string;
  action: string;
}

export interface QuoteEntry {
  speaker: string;
  context: string;
  text: string;
}

export interface VoteResult {
  yes: number;
  no: number;
  note: string;
  details: string[];
}

export interface TimelineEvent {
  id: string;
  indexNumber: string;
  dateLabel: string;
  shortDate: string;
  dayOfYear: number;
  title: string;
  officialTitle?: string;
  location?: string;
  phaseId: PhaseId;
  mechanism: MechanismId;
  mechanismLabel: string;
  summary: string;
  eventsAndMeasures: string[];
  actors: ActorEntry[];
  contextNotes?: string[];
  suspendedRights?: string[];
  quotes?: QuoteEntry[];
  hitlerReplyPoints?: string[];
  welsSpeechPoints?: string[];
  voteResult?: VoteResult;
  sourceWorkNote?: string;
  historicalCorrection?: string;
  institutionStates: Record<InstitutionId, InstitutionStatus>;
  newOrgans: Partial<Record<NewOrganId, NewOrganStatus>>;
  institutionNote: string;
}

export interface HistoricalPhase {
  id: PhaseId;
  numberLabel: string;
  title: string;
  periodLabel: string;
}

export const GUIDING_QUESTION =
  'Wie gelang es den Nationalsozialisten, die demokratische Ordnung zu beseitigen und ihre Herrschaft dauerhaft zu sichern?';

export const ARCHIVAL_IMAGES = {
  reichstag: reichstagImg,
  parliament: parliamentImg,
  decree: decreeImg,
  library: libraryImg,
} as const;

export const PHASES: HistoricalPhase[] = [
  {
    id: 'phase-1',
    numberLabel: '01',
    title: 'Machtübertragung und erste Maßnahmen',
    periodLabel: 'Januar–Februar 1933',
  },
  {
    id: 'phase-2',
    numberLabel: '02',
    title: 'Ermächtigungsgesetz & Ausschaltung des Parlaments',
    periodLabel: 'März–April 1933',
  },
  {
    id: 'phase-3',
    numberLabel: '03',
    title: 'Zerschlagung gesellschaftlicher Organisationen',
    periodLabel: 'Mai–Juli 1933',
  },
  {
    id: 'phase-4',
    numberLabel: '04',
    title: 'Ausbau des Führerstaates',
    periodLabel: 'Ab Juli 1933',
  },
];

export const MECHANISM_LABELS: Record<MechanismId, string> = {
  'staat-recht': 'Staat, Verfassung & Recht',
  'terror-verfolgung': 'Terror, Gewalt & Verfolgung',
  'gesellschaft-propaganda': 'Gesellschaft, Wirtschaft & Propaganda',
};

const ALL_NORMAL: Record<InstitutionId, InstitutionStatus> = {
  grundrechte: 'normal',
  reichstag: 'normal',
  regierung: 'normal',
  laender: 'normal',
  polizei: 'normal',
  parteien: 'normal',
  gewerkschaften: 'normal',
  kultur: 'normal',
  kirche: 'normal',
};

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'ernennung-hitler',
    indexNumber: '01',
    dateLabel: '30. Januar 1933',
    shortDate: '30. Jan',
    dayOfYear: 30,
    title: 'Ernennung Hitlers zum Reichskanzler',
    location: 'Berlin',
    phaseId: 'phase-1',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Hindenburg ernennt Hitler nach Verhandlungen mit konservativen Politikern zum Reichskanzler.',
    actors: [
      {
        name: 'Adolf Hitler',
        role: 'NSDAP, Reichskanzler',
        action:
          'Wird von Hindenburg zum Reichskanzler einer rechtskonservativen Koalitionsregierung ernannt und übernimmt die Regierungsführung.',
      },
      {
        name: 'Paul von Hindenburg',
        role: 'Reichspräsident',
        action:
          'Ernennt Hitler nach wochenlangen Verhandlungen verfassungsgemäß zum Reichskanzler.',
      },
      {
        name: 'Franz von Papen',
        role: 'Vizekanzler',
        action:
          'Handelt das Bündnis mit der NSDAP aus und wird Vizekanzler – in dem Irrglauben, Hitler kontrollieren zu können.',
      },
      {
        name: 'Alfred Hugenberg',
        role: 'DNVP',
        action:
          'Tritt als DNVP-Chef ins Kabinett ein (Wirtschaft & Ernährung) und stützt die rechte Mehrheitsbildung.',
      },
      {
        name: 'Wilhelm Frick',
        role: 'Minister',
        action:
          'Übernimmt als einer von nur drei Nationalsozialisten das Reichsinnenministerium.',
      },
      {
        name: 'Hermann Göring',
        role: 'Minister',
        action:
          'Wird Reichsminister ohne Geschäftsbereich und kommissarischer Innenminister in Preußen.',
      },
    ],
    eventsAndMeasures: [
      'Nur 3 Nationalsozialisten im Kabinett (Hitler, Frick, Göring).',
      'Konservative Ministermehrheit; Papen glaubt, Hitler kontrollieren zu können.',
    ],
    contextNotes: [
      'Ernennung formal auf Basis der Weimarer Verfassung – ermöglicht durch konservative Eliten.',
    ],
    institutionStates: { ...ALL_NORMAL, regierung: 'attacked' },
    newOrgans: {},
    institutionNote: 'Hitler übernimmt das Kanzleramt in einer Koalitionsregierung.',
  },
  {
    id: 'aufloesung-reichstag',
    indexNumber: '02',
    dateLabel: '1. Februar 1933',
    shortDate: '01. Feb',
    dayOfYear: 32,
    title: 'Auflösung des Reichstags',
    phaseId: 'phase-1',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Hindenburg löst auf Hitlers Vorschlag den Reichstag auf und setzt Neuwahlen für den 5. März an.',
    actors: [
      {
        name: 'Paul von Hindenburg',
        role: 'Reichspräsident',
        action:
          'Unterzeichnet die Auflösungsverordnung des Reichstags und setzt Neuwahlen für den 5. März 1933 an.',
      },
      {
        name: 'Adolf Hitler',
        role: 'Reichskanzler',
        action:
          'Beantragt die Parlamentsauflösung, um per Neuwahl eine eigene parlamentarische Mehrheit zu gewinnen.',
      },
      {
        name: 'NSDAP',
        role: 'Wahlkampf',
        action:
          'Startet sofort einen aggressiven, reichsweiten Wahlkampf mit staatlichen Machtmitteln im Rücken.',
      },
    ],
    eventsAndMeasures: [
      'Neuwahl am 5. März mit dem Ziel einer Regierungsmehrheit.',
      'Beginn eines massiven NSDAP-Wahlkampfs.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      regierung: 'attacked',
      reichstag: 'attacked',
    },
    newOrgans: {},
    institutionNote: 'Der Reichstag wird aufgelöst; die NSDAP startet den Wahlkampf.',
  },
  {
    id: 'verordnung-schutz-volk',
    indexNumber: '03',
    dateLabel: '4. Februar 1933',
    shortDate: '04. Feb',
    dayOfYear: 35,
    title: 'Verordnung zum Schutz des Deutschen Volkes',
    phaseId: 'phase-1',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Erste Einschränkungen der Versammlungs- und Pressefreiheit gegen politische Gegner.',
    actors: [
      {
        name: 'Reichsregierung',
        role: 'Verbotsbefugnisse',
        action:
          'Erlässt die Notverordnung, mit der Polizei und Behörden Versammlungen und oppositionelle Zeitungen verbieten dürfen.',
      },
    ],
    eventsAndMeasures: [
      'Behörden können politische Veranstaltungen und Zeitungen verbieten.',
      'Besonders betroffen: kommunistische und sozialdemokratische Organisationen.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      regierung: 'attacked',
      reichstag: 'attacked',
      grundrechte: 'attacked',
    },
    newOrgans: {},
    institutionNote: 'Versammlungs- und Pressefreiheit werden erstmals beschnitten.',
  },
  {
    id: 'geheimtreffen-wirtschaft',
    indexNumber: '04',
    dateLabel: '20. Februar 1933',
    shortDate: '20. Feb',
    dayOfYear: 51,
    title: 'Geheimtreffen mit Wirtschaftsvertretern',
    phaseId: 'phase-2',
    mechanism: 'gesellschaft-propaganda',
    mechanismLabel: MECHANISM_LABELS['gesellschaft-propaganda'],
    summary:
      'Industrielle und Bankiers sagen der NSDAP einen Wahlkampffonds von 3 Mio. Reichsmark zu.',
    actors: [
      {
        name: 'Adolf Hitler',
        role: 'Reichskanzler',
        action:
          'Erläutert vor rund 25 Großindustriellen seine Pläne zur Beseitigung der Demokratie und zur Aufrüstung.',
      },
      {
        name: 'Hermann Göring',
        role: 'Minister',
        action:
          'Lädt die Wirtschaftsführer in sein Palais ein und bittet offen um einen Wahlkampffonds für die Regierung.',
      },
      {
        name: 'Gustav Krupp',
        role: 'Schwerindustrie',
        action:
          'Bedankt sich als Vertreter der Schwerindustrie bei Hitler und unterstützt die Sammlung des Wahlfonds.',
      },
      {
        name: 'Albert Vögler',
        role: 'Schwerindustrie',
        action:
          'Nimmt als Vorstand der Vereinigten Stahlwerke teil und trägt die Finanzierung durch die Ruhrindustrie mit.',
      },
      {
        name: 'Hjalmar Schacht',
        role: 'Finanzwirtschaft',
        action:
          'Organisiert die Abwicklung des 3-Millionen-Reichsmark-Fonds zugunsten der NSDAP und ihrer Partner.',
      },
      {
        name: 'Kurt von Schröder',
        role: 'Bankier',
        action:
          'Vermittelt als Kölner Bankier zwischen Großindustrie und NSDAP und beteiligt sich am Spendenaufkommen.',
      },
    ],
    eventsAndMeasures: [
      'Wirtschaftsvertreter werden über die politischen Ziele informiert.',
      'Bereitstellung von 3 Millionen Reichsmark für den NSDAP-Wahlkampf.',
    ],
    historicalCorrection:
      'Im Text unter Abschnitt 2 („20. März“) genannt – fand historisch am 20. Februar 1933 statt.',
    institutionStates: {
      ...ALL_NORMAL,
      regierung: 'attacked',
      reichstag: 'attacked',
      grundrechte: 'attacked',
      parteien: 'attacked',
    },
    newOrgans: {},
    institutionNote: 'Millionenfinanzierung verschafft der NSDAP im Wahlkampf Vorteile.',
  },
  {
    id: 'sa-ss-hilfspolizei',
    indexNumber: '05',
    dateLabel: '22. Februar 1933',
    shortDate: '22. Feb',
    dayOfYear: 53,
    title: 'SA und SS werden Hilfspolizei in Preußen',
    location: 'Preußen',
    phaseId: 'phase-1',
    mechanism: 'terror-verfolgung',
    mechanismLabel: MECHANISM_LABELS['terror-verfolgung'],
    summary:
      'Göring verleiht parteigebundenen NS-Kampfverbänden staatliche Polizeibefugnisse.',
    actors: [
      {
        name: 'Hermann Göring',
        role: 'Preußen',
        action:
          'Beruft per Erlass rund 50.000 SA-, SS- und Stahlhelm-Männer als staatliche Hilfspolizisten in Preußen.',
      },
      {
        name: 'SA',
        role: 'Hilfspolizei',
        action:
          'Erhält Polizeigewalt, stürmt Parteilokale, schüchtert Wahlgegner ein und misshandelt Verhaftete.',
      },
      {
        name: 'SS',
        role: 'Hilfspolizei',
        action:
          'Wird ebenfalls mit Polizeibefugnissen ausgestattet und beteiligt sich an Razzien gegen politische Gegner.',
      },
      {
        name: 'Preußische Polizei',
        role: 'Staatspolizei',
        action:
          'Muss NS-Kampfverbände an ihrer Seite dulden und verliert die alleinige Kontrolle über Polizeieinsätze.',
      },
    ],
    eventsAndMeasures: [
      'Verhaftung, Einschüchterung und Misshandlung politischer Gegner.',
      'Grenze zwischen Polizei und NS-Gewaltverbänden verschwimmt.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      regierung: 'attacked',
      reichstag: 'attacked',
      grundrechte: 'attacked',
      parteien: 'attacked',
      polizei: 'attacked',
    },
    newOrgans: { hilfspolizei: 'created' },
    institutionNote: 'Neues Organ: SA und SS werden als Hilfspolizei mit Staatsgewalt ausgestattet.',
  },
  {
    id: 'reichstagsbrand',
    indexNumber: '06',
    dateLabel: '27. Februar 1933',
    shortDate: '27. Feb',
    dayOfYear: 58,
    title: 'Reichstagsbrand',
    location: 'Berlin',
    phaseId: 'phase-1',
    mechanism: 'terror-verfolgung',
    mechanismLabel: MECHANISM_LABELS['terror-verfolgung'],
    summary:
      'Das Reichstagsgebäude brennt; die NSDAP nutzt die Tat als Vorwand zur Gegnerverfolgung.',
    actors: [
      {
        name: 'Marinus van der Lubbe',
        role: 'Festgenommen',
        action:
          'Wird noch am Abend im brennenden Reichstagsgebäude als mutmaßlicher Brandstifter festgenommen.',
      },
      {
        name: 'Adolf Hitler',
        role: 'Reichskanzler',
        action:
          'Eilt zum Brandort und erklärt das Feuer zum Signal eines angeblichen kommunistischen Aufstands.',
      },
      {
        name: 'Hermann Göring',
        role: 'Polizeiführung',
        action:
          'Leitet noch in der Brandnacht eine Massenverhaftungswelle gegen Kommunisten und politische Gegner ein.',
      },
    ],
    eventsAndMeasures: [
      'Festnahme von Marinus van der Lubbe am Brandort.',
      'NS-Behauptung eines angeblichen kommunistischen Umsturzversuchs.',
    ],
    contextNotes: [
      'Tatsächliche Hintergründe und mögliche Mitbeteiligte sind historisch umstritten.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      regierung: 'attacked',
      reichstag: 'attacked',
      grundrechte: 'attacked',
      parteien: 'attacked',
      polizei: 'attacked',
    },
    newOrgans: { hilfspolizei: 'active' },
    institutionNote: 'Der Brand dient als Vorwand zur Verschärfung der Verfolgung.',
  },
  {
    id: 'reichstagsbrandverordnung',
    indexNumber: '07',
    dateLabel: '28. Februar 1933',
    shortDate: '28. Feb',
    dayOfYear: 59,
    title: 'Reichstagsbrandverordnung',
    officialTitle: 'Verordnung zum Schutz von Volk und Staat',
    phaseId: 'phase-1',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Auf Basis von Art. 48 WRV werden wesentliche Grundrechte dauerhaft außer Kraft gesetzt.',
    actors: [
      {
        name: 'Paul von Hindenburg',
        role: 'Art. 48',
        action:
          'Setzt mit seiner Unterschrift nach Art. 48 der Weimarer Verfassung zentrale Grundrechte auf unbestimmte Zeit aus.',
      },
      {
        name: 'Adolf Hitler',
        role: 'Reichskanzler',
        action:
          'Legt die Notverordnung vor und erhält damit die rechtliche Handhabe gegen jede politische Opposition.',
      },
      {
        name: 'Hermann Göring',
        role: 'Preußen',
        action:
          'Nutzt die Verordnung in Preußen sofort für massenhafte Verhaftungen und Zeitungsverbote.',
      },
      {
        name: 'Wilhelm Frick',
        role: 'Innenminister',
        action:
          'Zeichnet als Reichsinnenminister verantwortlich und weist Länderbehörden zur Umsetzung an.',
      },
    ],
    eventsAndMeasures: [
      '„Schutzhaft“ ohne richterliche Kontrolle sowie Hausdurchsuchungen.',
      'Verbot von Zeitungen und Versammlungen – gültig bis Kriegsende 1945.',
    ],
    suspendedRights: [
      'Persönliche Freiheit',
      'Meinungsfreiheit',
      'Pressefreiheit',
      'Versammlungsfreiheit',
      'Vereinigungsfreiheit',
      'Brief- & Fernmeldegeheimnis',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      regierung: 'attacked',
      reichstag: 'attacked',
      grundrechte: 'attacked',
      parteien: 'attacked',
      polizei: 'attacked',
    },
    newOrgans: { hilfspolizei: 'active' },
    institutionNote: 'Grundrechte werden per Notverordnung außer Kraft gesetzt.',
  },
  {
    id: 'reichstagswahl-1933',
    indexNumber: '08',
    dateLabel: '5. März 1933',
    shortDate: '05. Mär',
    dayOfYear: 64,
    title: 'Reichstagswahl',
    phaseId: 'phase-1',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Trotz Terror und Repression verfehlt die NSDAP mit 43,9 % die absolute Mehrheit; mit der DNVP reicht es für die Mehrheit.',
    actors: [
      {
        name: 'NSDAP',
        role: '43,9 %',
        action:
          'Erzielt trotz massivem Terror nur 43,9 % der Stimmen und verfehlt die erhoffte absolute Mehrheit.',
      },
      {
        name: 'DNVP',
        role: 'Koalitionspartner',
        action:
          'Kommt als „Kampffront Schwarz-Weiß-Rot“ auf 8 % und sichert dem Kabinett die knappe Regierungsmehrheit.',
      },
      {
        name: 'KPD & SPD',
        role: 'Verfolgte Opposition',
        action:
          'Behaupten zusammen rund 30 % der Stimmen, obwohl ihre Abgeordneten und Wahlkämpfer massiv verfolgt werden.',
      },
    ],
    eventsAndMeasures: [
      '43,9 % NSDAP; nur zusammen mit DNVP parlamentarische Mehrheit.',
      'Wahlkampf geprägt von Gewalt und Verfolgung von KPD- und SPD-Politikern.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      regierung: 'attacked',
      reichstag: 'attacked',
      parteien: 'attacked',
      polizei: 'attacked',
    },
    newOrgans: { hilfspolizei: 'active' },
    institutionNote: 'Grundrechte bleiben dauerhaft zerstört; unfreie Wahl unter Terror.',
  },
  {
    id: 'tag-von-potsdam',
    indexNumber: '09',
    dateLabel: '21. März 1933',
    shortDate: '21. Mär',
    dayOfYear: 80,
    title: 'Tag von Potsdam',
    location: 'Garnisonkirche Potsdam',
    phaseId: 'phase-2',
    mechanism: 'gesellschaft-propaganda',
    mechanismLabel: MECHANISM_LABELS['gesellschaft-propaganda'],
    summary:
      'Propagandistische Inszenierung der Einheit von NS-Bewegung und preußisch-konservativen Eliten.',
    actors: [
      {
        name: 'Adolf Hitler',
        role: 'Reichskanzler',
        action:
          'Verneigt sich demonstrativ im Frack vor Hindenburg, um bürgerlich-konservative Wähler zu beruhigen.',
      },
      {
        name: 'Paul von Hindenburg',
        role: 'Reichspräsident',
        action:
          'Verleiht der NS-Regierung durch seinen Handschlag in der Garnisonkirche die Autorität des alten Preußens.',
      },
      {
        name: 'Franz von Papen',
        role: 'Vizekanzler',
        action:
          'Wirkt an der feierlichen Staatsinszenierung mit, um die konservative Koalition öffentlich zu festigen.',
      },
      {
        name: 'NSDAP',
        role: 'Regierungspartei',
        action:
          'Nutzt den Tag über Rundfunk und Presse als riesiges Propagandafest zur eigenen Legitimation.',
      },
    ],
    eventsAndMeasures: [
      'Feierliche Reichstagseröffnung; Hitler gibt sich demonstrativ respektvoll.',
      'Soll Vertrauen bei traditionellen gesellschaftlichen Eliten gewinnen.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      regierung: 'attacked',
      reichstag: 'attacked',
      parteien: 'attacked',
      polizei: 'attacked',
    },
    newOrgans: { hilfspolizei: 'active' },
    institutionNote: 'Traditionelle Eliten und Reichspräsident werden propagandistisch eingebunden.',
  },
  {
    id: 'kz-dachau',
    indexNumber: '10',
    dateLabel: '22. März 1933',
    shortDate: '22. Mär',
    dayOfYear: 81,
    title: 'Erste Häftlinge im KZ Dachau',
    location: 'Dachau',
    phaseId: 'phase-2',
    mechanism: 'terror-verfolgung',
    mechanismLabel: MECHANISM_LABELS['terror-verfolgung'],
    summary:
      'Einrichtung des Konzentrationslagers Dachau unter Schutzhaft-Vorwand als Vorbild für das Lagersystem.',
    actors: [
      {
        name: 'Heinrich Himmler',
        role: 'SS-Chef',
        action:
          'Kündigt als kommissarischer Münchner Polizeipräsident die Eröffnung des Lagers für „Schutzhäftlinge“ an.',
      },
      {
        name: 'SS',
        role: 'Lagerleitung',
        action:
          'Übernimmt kurz darauf Bewachung und Leitung des Lagers außerhalb jeder gerichtlichen Kontrolle.',
      },
      {
        name: 'Bayerische Polizei',
        role: 'Behörde',
        action:
          'Liefert die ersten festgenommenen Kommunisten, Sozialdemokraten und Gewerkschafter in das Lager ein.',
      },
    ],
    eventsAndMeasures: [
      'Erste Häftlinge: Kommunisten, Sozialdemokraten und Gewerkschafter.',
      'Wird zum organisatorischen Modell für spätere Konzentrationslager.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      regierung: 'attacked',
      reichstag: 'attacked',
      polizei: 'attacked',
      parteien: 'attacked',
      gewerkschaften: 'attacked',
    },
    newOrgans: { hilfspolizei: 'active', 'kz-system': 'created' },
    institutionNote: 'Neues Organ: Mit dem KZ Dachau entsteht das dauerhafte Konzentrationslagersystem.',
  },
  {
    id: 'ermaechtigungsgesetz',
    indexNumber: '11',
    dateLabel: '23. März 1933',
    shortDate: '23. Mär',
    dayOfYear: 82,
    title: 'Ermächtigungsgesetz',
    officialTitle: 'Gesetz zur Behebung der Not von Volk und Reich',
    location: 'Krolloper Berlin',
    phaseId: 'phase-2',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Die Reichsregierung darf Gesetze ohne Reichstag und abweichend von der Verfassung erlassen.',
    actors: [
      {
        name: 'Adolf Hitler',
        role: 'Reichskanzler',
        action:
          'Fordert in seiner Regierungserklärung die Annahme des Gesetzes und droht offen mit Gewalt bei Ablehnung.',
      },
      {
        name: 'Otto Wels',
        role: 'SPD',
        action:
          'Begründet trotz Einschüchterung durch SA-Posten mutig das geschlossene „Nein“ der Sozialdemokraten.',
      },
      {
        name: 'Hermann Göring',
        role: 'Reichstagspräsident',
        action:
          'Leitet die Sitzung in der Krolloper und lässt KPD-Mandate sowie inhaftierte Abgeordnete ausschließen.',
      },
      {
        name: 'Paul von Hindenburg',
        role: 'Reichspräsident',
        action:
          'Fertigt das vom Reichstag und Reichsrat beschlossene Gesetz am Folgetag aus.',
      },
    ],
    eventsAndMeasures: [
      'Gesetzgebung geht auf 4 Jahre befristet an die Regierung über.',
      'KPD-Mandate annulliert; zahlreiche SPD-Abgeordnete verhaftet.',
    ],
    voteResult: {
      yes: 444,
      no: 94,
      note: 'SPD stimmt geschlossen dagegen.',
      details: ['KPD ausgeschlossen; SPD-Abgeordnete teilweise inhaftiert.'],
    },
    quotes: [
      {
        speaker: 'Otto Wels (SPD)',
        context: 'Reichstagsrede, 23. März 1933',
        text: '„Freiheit und Leben kann man uns nehmen, die Ehre nicht.“',
      },
    ],
    welsSpeechPoints: [
      'Verteidigung der Demokratie, Meinungsfreiheit und Ablehnung der Selbstentmachtung.',
    ],
    hitlerReplyPoints: [
      'Weist Kritik zurück und kündigt Politik unabhängig vom Parlament an.',
    ],
    sourceWorkNote:
      'Vollständige Redetexte aus dem stenografischen Reichstagsprotokoll (23. März 1933).',
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      reichstag: 'attacked',
      regierung: 'attacked',
      polizei: 'attacked',
      parteien: 'attacked',
      gewerkschaften: 'attacked',
    },
    newOrgans: { hilfspolizei: 'active', 'kz-system': 'active' },
    institutionNote: 'Der Reichstag entmachtet sich selbst; die Regierung regiert ohne Parlament.',
  },
  {
    id: 'gleichschaltung-laender-1',
    indexNumber: '12',
    dateLabel: '31. März 1933',
    shortDate: '31. Mär',
    dayOfYear: 90,
    title: '1. Gesetz zur Gleichschaltung der Länder',
    phaseId: 'phase-2',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Anpassung der Landtage an die Reichstagswahl vom 5. März ohne KPD-Sitze.',
    actors: [
      {
        name: 'Reichsregierung',
        role: 'Exekutive',
        action:
          'Erlässt mithilfe des Ermächtigungsgesetzes die Umbildung aller Landtage nach dem Reichstagswahlergebnis.',
      },
    ],
    eventsAndMeasures: [
      'Länderparlamente verlieren ihre politische Eigenständigkeit.',
      'KPD-Mandate bleiben unberücksichtigt.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      reichstag: 'destroyed',
      regierung: 'destroyed',
      laender: 'attacked',
      polizei: 'attacked',
      parteien: 'attacked',
      gewerkschaften: 'attacked',
    },
    newOrgans: { hilfspolizei: 'active', 'kz-system': 'active' },
    institutionNote: 'Parlament und Gewaltenteilung sind ausgeschaltet; Gleichschaltung der Länder beginnt.',
  },
  {
    id: 'gleichschaltung-laender-2',
    indexNumber: '13',
    dateLabel: '7. April 1933',
    shortDate: '07. Apr',
    dayOfYear: 97,
    title: '2. Gesetz zur Gleichschaltung der Länder',
    phaseId: 'phase-2',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Reichsstatthalter kontrollieren die Landesregierungen – der Föderalismus wird beseitigt.',
    actors: [
      {
        name: 'Reichsregierung',
        role: 'Reichsstatthalter',
        action:
          'Schafft das Amt der Reichsstatthalter, die Landesregierungen einsetzen, Landtage auflösen und Landesgesetze stoppen können.',
      },
    ],
    eventsAndMeasures: [
      'Einsetzung von Reichsstatthaltern in allen Ländern.',
      'Föderale Eigenständigkeit wird stark eingeschränkt.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      reichstag: 'destroyed',
      regierung: 'destroyed',
      laender: 'attacked',
      polizei: 'attacked',
      parteien: 'attacked',
      gewerkschaften: 'attacked',
    },
    newOrgans: {
      hilfspolizei: 'active',
      'kz-system': 'active',
      reichsstatthalter: 'created',
    },
    institutionNote: 'Neues Organ: Reichsstatthalter unterstellen die Länder direkt der Berliner Zentrale.',
  },
  {
    id: 'berufsbeamtentum',
    indexNumber: '14',
    dateLabel: '7. April 1933',
    shortDate: '07. Apr',
    dayOfYear: 97,
    title: 'Gesetz zur Wiederherstellung des Berufsbeamtentums',
    phaseId: 'phase-2',
    mechanism: 'terror-verfolgung',
    mechanismLabel: MECHANISM_LABELS['terror-verfolgung'],
    summary:
      'Einführung des „Arierparagraphs“; Entlassung politisch missliebiger und jüdischer Beamter.',
    actors: [
      {
        name: 'Adolf Hitler',
        role: 'Reichskanzler',
        action:
          'Unterzeichnet das Gesetz zur Säuberung von Justiz, Verwaltung, Schulen und Hochschulen.',
      },
      {
        name: 'Wilhelm Frick',
        role: 'Innenminister',
        action:
          'Entwirft das Gesetz samt „Arierparagraph“ zur Entlassung demokratischer und jüdischer Staatsdiener.',
      },
    ],
    eventsAndMeasures: [
      'Entfernung politischer Gegner und jüdischer Beamter aus dem Staatsdienst.',
      'Anfangs Ausnahmen für bestimmte Frontkämpfer des Ersten Weltkriegs.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      reichstag: 'destroyed',
      regierung: 'destroyed',
      laender: 'destroyed',
      polizei: 'attacked',
      parteien: 'attacked',
      gewerkschaften: 'attacked',
    },
    newOrgans: {
      hilfspolizei: 'active',
      'kz-system': 'active',
      reichsstatthalter: 'active',
    },
    institutionNote: 'Föderalismus zerstört; Verwaltung und Beamtentum werden im NS-Sinn gesäubert.',
  },
  {
    id: 'tag-der-nationalen-arbeit',
    indexNumber: '15',
    dateLabel: '1. Mai 1933',
    shortDate: '01. Mai',
    dayOfYear: 121,
    title: 'Tag der nationalen Arbeit',
    phaseId: 'phase-3',
    mechanism: 'gesellschaft-propaganda',
    mechanismLabel: MECHANISM_LABELS['gesellschaft-propaganda'],
    summary:
      '1. Mai wird gesetzlicher Feiertag; Regime inszeniert sich bei Großkundgebungen als Arbeitervertreter.',
    actors: [
      {
        name: 'NSDAP',
        role: 'Veranstalter',
        action:
          'Erklärt den 1. Mai zum bezahlten Feiertag und veranstaltet riesige Propagandakundgebungen (u. a. in Berlin-Tempelhof).',
      },
      {
        name: 'Gewerkschaften',
        role: 'Teilnahme',
        action:
          'Rufen teils zur Teilnahme an den Mai-Umzügen auf, um ihre Organisation vor einem Verbot zu schützen.',
      },
    ],
    eventsAndMeasures: [
      'Gewerkschaftsvertreter beteiligen sich an den NS-Feierlichkeiten.',
      'Täuschung und propagandistische Einbindung vor dem Zugriff am Folgetag.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      reichstag: 'destroyed',
      regierung: 'destroyed',
      laender: 'destroyed',
      polizei: 'destroyed',
      parteien: 'attacked',
      gewerkschaften: 'attacked',
    },
    newOrgans: {
      hilfspolizei: 'active',
      'kz-system': 'active',
      reichsstatthalter: 'active',
    },
    institutionNote: 'Staatliche Verwaltung ist gleichgeschaltet; Arbeiterschaft wird umworben.',
  },
  {
    id: 'zerschlagung-gewerkschaften',
    indexNumber: '16',
    dateLabel: '2. Mai 1933',
    shortDate: '02. Mai',
    dayOfYear: 122,
    title: 'Zerschlagung der Gewerkschaften',
    phaseId: 'phase-3',
    mechanism: 'terror-verfolgung',
    mechanismLabel: MECHANISM_LABELS['terror-verfolgung'],
    summary:
      'SA und NSBO besetzen Gewerkschaftshäuser, verhaften Führer und beschlagnahmen Vermögen.',
    actors: [
      {
        name: 'SA',
        role: 'Besetzung',
        action:
          'Stürmt am Morgen deutschlandweit die Gewerkschaftshäuser und verschleppt zahlreiche Gewerkschaftsfunktionäre.',
      },
      {
        name: 'NSBO',
        role: 'NS-Betriebszellen',
        action:
          'Übernimmt gemeinsam mit der SA die Büros, Kassen und Zeitungen der freien Gewerkschaften.',
      },
      {
        name: 'Gewerkschaften',
        role: 'Zerschlagen',
        action:
          'Werden entmachtet, enteignet und verlieren jede eigenständige Interessenvertretung der Arbeitnehmer.',
      },
    ],
    eventsAndMeasures: [
      'Freie Gewerkschaften werden gewaltsam zerschlagen.',
      'Unabhängige Interessenvertretung der Arbeitnehmer beseitigt.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      reichstag: 'destroyed',
      regierung: 'destroyed',
      laender: 'destroyed',
      polizei: 'destroyed',
      parteien: 'attacked',
      gewerkschaften: 'attacked',
    },
    newOrgans: {
      hilfspolizei: 'active',
      'kz-system': 'active',
      reichsstatthalter: 'active',
    },
    institutionNote: 'Gewerkschaftshäuser werden gestürmt und die Arbeitnehmervertretung zerschlagen.',
  },
  {
    id: 'gruendung-daf',
    indexNumber: '17',
    dateLabel: '10. Mai 1933',
    shortDate: '10. Mai',
    dayOfYear: 130,
    title: 'Gründung der Deutschen Arbeitsfront (DAF)',
    phaseId: 'phase-3',
    mechanism: 'gesellschaft-propaganda',
    mechanismLabel: MECHANISM_LABELS['gesellschaft-propaganda'],
    summary:
      'Zwangsvereinigung von Arbeitnehmern und Arbeitgebern unter Robert Ley – ohne Streikrecht.',
    actors: [
      {
        name: 'Robert Ley',
        role: 'DAF-Leiter',
        action:
          'Wird Leiter der neu gegründeten DAF und unterstellt die gesamte Arbeiterschaft der nationalsozialistischen Kontrolle.',
      },
      {
        name: 'Deutsche Arbeitsfront (DAF)',
        role: 'Kontrollorgan',
        action:
          'Ersetzt die verbotenen Gewerkschaften als einheitliche NS-Massenorganisation für Arbeitnehmer und Arbeitgeber.',
      },
    ],
    eventsAndMeasures: [
      'Tarifautonomie und Streikrecht werden abgeschafft.',
      'DAF dient nicht dem Schutz, sondern der Kontrolle der Arbeiterschaft.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      reichstag: 'destroyed',
      regierung: 'destroyed',
      laender: 'destroyed',
      polizei: 'destroyed',
      parteien: 'attacked',
      gewerkschaften: 'attacked',
    },
    newOrgans: {
      hilfspolizei: 'active',
      'kz-system': 'active',
      reichsstatthalter: 'active',
      daf: 'created',
    },
    institutionNote: 'Neues Organ: Die DAF ersetzt freie Gewerkschaften und schafft Streikrecht ab.',
  },
  {
    id: 'buecherverbrennungen',
    indexNumber: '18',
    dateLabel: '10. Mai 1933',
    shortDate: '10. Mai',
    dayOfYear: 130,
    title: 'Bücherverbrennungen',
    phaseId: 'phase-3',
    mechanism: 'gesellschaft-propaganda',
    mechanismLabel: MECHANISM_LABELS['gesellschaft-propaganda'],
    summary:
      'NS-Studentenverbände verbrennen öffentlich Werke jüdischer, marxistischer und pazifistischer Autoren.',
    actors: [
      {
        name: 'NS-Studentenverbände',
        role: 'Organisatoren',
        action:
          'Sammeln „undeutsche“ Literatur aus Bibliotheken und Buchhandlungen und verbrennen sie öffentlich auf Scheiterhaufen.',
      },
      {
        name: 'Erich Kästner',
        role: 'Autor',
        action:
          'Sieht in Berlin unerkannt als einziger der verfemten Schriftsteller persönlich mit an, wie seine eigenen Bücher brennen.',
      },
      {
        name: 'Heinrich Mann',
        role: 'Autor',
        action:
          'Seine gesellschaftskritischen Werke werden verbrannt; er war bereits kurz zuvor ins französische Exil geflohen.',
      },
      {
        name: 'Erich Maria Remarque',
        role: 'Autor',
        action:
          'Sein Antikriegsroman „Im Westen nichts Neues“ wird unter „Feuersprüchen“ gegen Pazifismus den Flammen übergeben.',
      },
      {
        name: 'Bertolt Brecht',
        role: 'Autor',
        action:
          'Seine politischen Stücke und Gedichte landen auf dem Index und werden öffentlich verbrannt; Brecht lebt bereits im Exil.',
      },
    ],
    eventsAndMeasures: [
      'Aktion zur kulturellen Gleichschaltung von Literatur und Universitäten.',
      'Verbrannt u. a. Kästner, Heinrich Mann, Remarque und Brecht.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      reichstag: 'destroyed',
      regierung: 'destroyed',
      laender: 'destroyed',
      polizei: 'destroyed',
      gewerkschaften: 'destroyed',
      parteien: 'attacked',
      kultur: 'attacked',
    },
    newOrgans: {
      hilfspolizei: 'active',
      'kz-system': 'active',
      reichsstatthalter: 'active',
      daf: 'active',
    },
    institutionNote: 'Freie Gewerkschaften sind zerstört; nun greift die kulturelle Gleichschaltung.',
  },
  {
    id: 'verbot-spd',
    indexNumber: '19',
    dateLabel: '22. Juni 1933',
    shortDate: '22. Jun',
    dayOfYear: 173,
    title: 'Verbot der SPD',
    phaseId: 'phase-3',
    mechanism: 'terror-verfolgung',
    mechanismLabel: MECHANISM_LABELS['terror-verfolgung'],
    summary:
      'Offizielles Verbot der Sozialdemokraten, Vermögensbeschlagnahmung und Verfolgung.',
    actors: [
      {
        name: 'SPD',
        role: 'Verbotene Partei',
        action:
          'Wird von Innenminister Frick als „volks- und staatsfeindlich“ verboten; alle Mandate werden annulliert.',
      },
      {
        name: 'Otto Wels',
        role: 'SPD-Vorsitz',
        action:
          'Organisiert als Parteivorsitzender aus dem Exil in Prag (Sopade) den politischen Widerstand gegen das Regime.',
      },
    ],
    eventsAndMeasures: [
      'SPD-Parteivermögen wird beschlagnahmt.',
      'Sozialdemokratische Politiker werden verhaftet und verfolgt.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      reichstag: 'destroyed',
      regierung: 'destroyed',
      laender: 'destroyed',
      polizei: 'destroyed',
      gewerkschaften: 'destroyed',
      kultur: 'destroyed',
      parteien: 'attacked',
    },
    newOrgans: {
      hilfspolizei: 'active',
      'kz-system': 'active',
      reichsstatthalter: 'active',
      daf: 'active',
    },
    institutionNote: 'Kultur ist gleichgeschaltet; die letzte große demokratische Opposition wird verboten.',
  },
  {
    id: 'selbstaufloesung-parteien',
    indexNumber: '20',
    dateLabel: 'Juni–Juli 1933',
    shortDate: 'Jun–Jul',
    dayOfYear: 186,
    title: 'Selbstauflösung anderer Parteien',
    phaseId: 'phase-3',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Unter politischem Druck lösen sich Zentrum (5. Juli), BVP und weitere Parteien selbst auf.',
    actors: [
      {
        name: 'Zentrumspartei',
        role: 'Aufgelöst 5. Juli',
        action:
          'Löst sich am 5. Juli 1933 als letzte bürgerliche Partei unter Druck und im Zuge der Konkordatsverhandlungen selbst auf.',
      },
      {
        name: 'Bayerische Volkspartei',
        role: 'Aufgelöst',
        action:
          'Gibt am 4. Juli nach Verhaftungen eigener Abgeordneter und Drohungen der NS-Behörden ihren Bestand auf.',
      },
      {
        name: 'NSDAP',
        role: 'Einzige Partei',
        action:
          'Übt massiven Druck auf alle noch bestehenden Parteien aus und bleibt als einzige politische Organisation übrig.',
      },
    ],
    eventsAndMeasures: [
      'Zentrumspartei und Bayerische Volkspartei geben auf.',
      'Die NSDAP bleibt als einzige politische Kraft übrig.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      reichstag: 'destroyed',
      regierung: 'destroyed',
      laender: 'destroyed',
      polizei: 'destroyed',
      gewerkschaften: 'destroyed',
      kultur: 'destroyed',
      parteien: 'attacked',
    },
    newOrgans: {
      hilfspolizei: 'active',
      'kz-system': 'active',
      reichsstatthalter: 'active',
      daf: 'active',
    },
    institutionNote: 'Bürgerliche Parteien lösen sich unter Druck selbst auf.',
  },
  {
    id: 'einparteienstaat-gesetz',
    indexNumber: '21',
    dateLabel: '14. Juli 1933',
    shortDate: '14. Jul',
    dayOfYear: 195,
    title: 'Gesetz gegen die Neubildung von Parteien',
    phaseId: 'phase-3',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Die NSDAP wird gesetzlich zur einzigen Partei erklärt – der Einparteienstaat steht.',
    actors: [
      {
        name: 'NSDAP',
        role: 'Staatspartei',
        action:
          'Wird im Gesetzestext als „einzige politische Partei“ Deutschlands festgeschrieben und erhält ein Machtmonopol.',
      },
      {
        name: 'Reichsregierung',
        role: 'Gesetzgeber',
        action:
          'Bedroht jeden Versuch, eine andere Partei aufrechtzuerhalten oder neu zu gründen, mit Zuchthaus- oder Gefängnisstrafen.',
      },
    ],
    eventsAndMeasures: [
      'Gründung oder Unterstützung anderer Parteien wird unter Strafe gestellt.',
      'Das Mehrparteiensystem ist endgültig abgeschafft.',
    ],
    institutionStates: {
      ...ALL_NORMAL,
      grundrechte: 'destroyed',
      reichstag: 'destroyed',
      regierung: 'destroyed',
      laender: 'destroyed',
      polizei: 'destroyed',
      gewerkschaften: 'destroyed',
      kultur: 'destroyed',
      parteien: 'attacked',
    },
    newOrgans: {
      hilfspolizei: 'active',
      'kz-system': 'active',
      reichsstatthalter: 'active',
      daf: 'active',
      einparteienstaat: 'created',
    },
    institutionNote: 'Neues Organ: Der NSDAP-Einparteienstaat wird per Gesetz festgeschrieben.',
  },
  {
    id: 'reichskonkordat',
    indexNumber: '22',
    dateLabel: '20. Juli 1933',
    shortDate: '20. Jul',
    dayOfYear: 201,
    title: 'Reichskonkordat mit dem Vatikan',
    phaseId: 'phase-4',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Vertrag zwischen Deutschem Reich und Vatikan regelt das Verhältnis zur katholischen Kirche.',
    actors: [
      {
        name: 'Adolf Hitler',
        role: 'Reichskanzler',
        action:
          'Gewinnt durch den Vertrag mit dem Vatikan internationale Anerkennung und drängt den politischen Katholizismus zurück.',
      },
      {
        name: 'Eugenio Pacelli',
        role: 'Kardinalstaatssekretär',
        action:
          'Unterzeichnet das Konkordat für den Vatikan in Rom – im Gegenzug für kirchliche Schutzgarantien verzichtet der Klerus auf Parteipolitik.',
      },
      {
        name: 'Papst Pius XI.',
        role: 'Vatikan',
        action:
          'Genehmigt den völkerrechtlichen Vertrag, um katholische Schulen und Seelsorge in Deutschland rechtlich abzusichern.',
      },
    ],
    eventsAndMeasures: [
      'Staatsvertrag zwischen dem Deutschen Reich und dem Vatikan.',
      'Regelungen zum Verhältnis zwischen Staat und katholischer Kirche.',
    ],
    institutionStates: {
      grundrechte: 'destroyed',
      reichstag: 'destroyed',
      regierung: 'destroyed',
      laender: 'destroyed',
      polizei: 'destroyed',
      gewerkschaften: 'destroyed',
      kultur: 'destroyed',
      parteien: 'destroyed',
      kirche: 'attacked',
    },
    newOrgans: {
      hilfspolizei: 'active',
      'kz-system': 'active',
      reichsstatthalter: 'active',
      daf: 'active',
      einparteienstaat: 'active',
    },
    institutionNote: 'Alle politischen Gegenkräfte sind zerstört; neue NS-Organe beherrschen Staat und Gesellschaft.',
  },
];
