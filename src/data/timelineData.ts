export type PhaseId = 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4';

export type MechanismId =
  | 'staat-recht'
  | 'terror-verfolgung'
  | 'gesellschaft-propaganda';

export interface ActorEntry {
  name: string;
  role?: string;
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
  /** Numeric day-of-year (1933) for proportional horizontal timeline placement */
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
  image?: {
    src: string;
    alt: string;
    caption: string;
  };
}

export interface HistoricalPhase {
  id: PhaseId;
  numberLabel: string;
  title: string;
  periodLabel: string;
  description: string;
  image: {
    src: string;
    alt: string;
    caption: string;
  };
}

export const GUIDING_QUESTION =
  'Wie gelang es den Nationalsozialisten, die demokratische Ordnung zu beseitigen und ihre Herrschaft dauerhaft zu sichern?';

export const ARCHIVAL_IMAGES = {
  reichstag: '/src/assets/images/hero_weimar_reichstag_1794822380073.jpg',
  parliament: '/src/assets/images/phase_parliament_chamber_1794822380719.jpg',
  decree: '/src/assets/images/phase_archival_decree_1794822382633.jpg',
  library: '/src/assets/images/phase_memorial_library_1794822382260.jpg',
} as const;

export const PHASES: HistoricalPhase[] = [
  {
    id: 'phase-1',
    numberLabel: '01',
    title: 'Machtübertragung und erste Maßnahmen',
    periodLabel: 'Januar–Februar 1933 (inkl. Wahl 5. März)',
    description:
      'Ernennung Hitlers zum Reichskanzler durch konservative Eliten, Auflösung des Reichstags, Ausbau der Gewaltbefugnisse und Außerkraftsetzung zentraler Grundrechte.',
    image: {
      src: ARCHIVAL_IMAGES.reichstag,
      alt: 'Historische Aufnahme des Berliner Reichstagsgebäudes',
      caption: 'Abb. 1 · Das Reichstagsgebäude in Berlin, Schauplatz des Übergangs von der Weimarer Republik zur NS-Diktatur.',
    },
  },
  {
    id: 'phase-2',
    numberLabel: '02',
    title: 'Ermächtigungsgesetz und Ausschaltung des Parlamentarismus',
    periodLabel: 'März–April 1933',
    description:
      'Bündnisinszenierung mit alten Eliten, Errichtung des ersten Konzentrationslagers in Dachau, Verfassungsdurchbrechung durch das Ermächtigungsgesetz und Gleichschaltung von Ländern und Verwaltung.',
    image: {
      src: ARCHIVAL_IMAGES.parliament,
      alt: 'Historischer Plenarsaal mit aufsteigenden Sitzreihen',
      caption: 'Abb. 2 · Parlamentarischer Sitzungssaal – mit dem Ermächtigungsgesetz vom 23. März 1933 entmachtete sich der Reichstag selbst.',
    },
  },
  {
    id: 'phase-3',
    numberLabel: '03',
    title: 'Zerschlagung gesellschaftlicher Organisationen',
    periodLabel: 'Mai–Juli 1933',
    description:
      'Zerschlagung freier Gewerkschaften, kulturelle Gleichschaltung durch Bücherverbrennungen, Verbot der SPD, Selbstauflösung der bürgerlichen Parteien und gesetzliche Festschreibung des Einparteienstaates.',
    image: {
      src: ARCHIVAL_IMAGES.library,
      alt: 'Teilweise geleerte hölzerne Bibliotheksregale im gedämpften Licht',
      caption: 'Abb. 3 · Geleistete Gleichschaltung von Kultur und Gesellschaft im Mai 1933.',
    },
  },
  {
    id: 'phase-4',
    numberLabel: '04',
    title: 'Ausbau des Führerstaates',
    periodLabel: 'August–Dezember 1933 (inkl. Konkordat vom 20. Juli)',
    description:
      'Vertragliche Regelung des Verhältnisses zwischen dem Deutschen Reich und dem Vatikan im Zuge der weiteren Konsolidierung des Regimes.',
    image: {
      src: ARCHIVAL_IMAGES.decree,
      alt: 'Archivierte Gesetzestexte und Urkunden aus dem Jahr 1933',
      caption: 'Abb. 4 · Staatsrechtliche Verträge und Verordnungen zur Absicherung der Herrschaft.',
    },
  },
];

export const MECHANISM_LABELS: Record<MechanismId, string> = {
  'staat-recht': 'Staat, Verfassung & Recht',
  'terror-verfolgung': 'Terror, Gewalt & Verfolgung',
  'gesellschaft-propaganda': 'Gesellschaft, Wirtschaft & Propaganda',
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
      'Reichspräsident Paul von Hindenburg ernennt Adolf Hitler nach Verhandlungen mit konservativen Politikern zum Reichskanzler einer Koalitionsregierung.',
    actors: [
      { name: 'Adolf Hitler', role: 'Vorsitzender der NSDAP, neuer Reichskanzler' },
      { name: 'Paul von Hindenburg', role: 'Reichspräsident' },
      { name: 'Franz von Papen', role: 'Ehemaliger Reichskanzler und neuer Vizekanzler' },
      { name: 'Alfred Hugenberg', role: 'Vorsitzender der DNVP' },
      { name: 'Wilhelm Frick', role: 'Nationalsozialistischer Minister im Kabinett' },
      { name: 'Hermann Göring', role: 'Nationalsozialistischer Minister im Kabinett' },
    ],
    eventsAndMeasures: [
      'Hindenburg ernennt Hitler zum Reichskanzler.',
      'Vorausgegangen sind Verhandlungen zwischen Hitler, Papen und konservativen Politikern.',
      'Im Kabinett sitzen zunächst nur drei Nationalsozialisten: Hitler, Wilhelm Frick und Hermann Göring.',
      'Die Mehrheit der Minister gehört konservativen oder parteilosen Kreisen an.',
      'Papen wird Vizekanzler und glaubt, Hitler politisch kontrollieren zu können.',
    ],
    contextNotes: [
      'Hitler war nicht durch eine direkte Volkswahl zum Reichskanzler geworden.',
      'Die Ernennung erfolgte formal auf Grundlage der Weimarer Verfassung.',
      'Konservative Eliten ermöglichten Hitler den Zugang zur Staatsmacht.',
    ],
    image: {
      src: ARCHIVAL_IMAGES.reichstag,
      alt: 'Reichstagsgebäude in Berlin',
      caption: 'Berlin, Januar 1933 · Ausgangspunkt der Machtübertragung an die Regierung Hitler–Papen.',
    },
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
      'Auf Vorschlag Hitlers löst Reichspräsident Hindenburg den Reichstag auf und setzt Neuwahlen für den 5. März an.',
    actors: [
      { name: 'Paul von Hindenburg', role: 'Reichspräsident' },
      { name: 'Adolf Hitler', role: 'Reichskanzler' },
      { name: 'NSDAP', role: 'Regierungspartei im Wahlkampf' },
    ],
    eventsAndMeasures: [
      'Hindenburg löst auf Vorschlag Hitlers den Reichstag auf.',
      'Neuwahlen werden für den 5. März angesetzt.',
      'Hitler erhofft sich eine parlamentarische Mehrheit für seine Regierung.',
      'Die NSDAP beginnt einen massiven Wahlkampf.',
    ],
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
      'Erste einschneidende Beschränkungen von Versammlungs- und Pressefreiheit, gezielt gegen die linke Opposition.',
    actors: [
      { name: 'Reichsregierung / Behörden', role: 'Durchsetzung von Verboten' },
    ],
    eventsAndMeasures: [
      'Einschränkung der Versammlungs- und Pressefreiheit.',
      'Behörden erhalten zusätzliche Möglichkeiten, politische Veranstaltungen und Veröffentlichungen zu verbieten.',
      'Besonders betroffen sind kommunistische und sozialdemokratische Organisationen.',
    ],
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
      'Hitler und Göring informieren führende Industrielle und Bankiers über die politischen Ziele der Regierung und sichern einen Wahlkampffonds von drei Millionen Reichsmark.',
    actors: [
      { name: 'Adolf Hitler', role: 'Reichskanzler' },
      { name: 'Hermann Göring', role: 'Reichstagspräsident / Minister' },
      { name: 'Gustav Krupp von Bohlen und Halbach', role: 'Vertreter der Schwerindustrie' },
      { name: 'Albert Vögler', role: 'Vertreter der Schwerindustrie' },
      { name: 'Hjalmar Schacht', role: 'Finanzexperte' },
      { name: 'Kurt von Schröder', role: 'Bankier' },
    ],
    eventsAndMeasures: [
      'Hitler trifft sich mit führenden Vertretern der deutschen Industrie und Finanzwirtschaft.',
      'Die Teilnehmer werden über die politischen Ziele der Regierung informiert.',
      'Es wird ein Wahlkampffonds von drei Millionen Reichsmark bereitgestellt.',
      'Vertreter der Schwerindustrie und Banken unterstützen damit die NSDAP finanziell.',
    ],
    historicalCorrection:
      'Hinweis aus der Datensammlung: Im Gliederungsabschnitt „2. März–April 1933“ unter „20. März 1933“ eingeordnet – das Treffen fand historisch jedoch am 20. Februar 1933 statt, nicht am 20. März.',
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
      'Hermann Göring verleiht den parteigebundenen Kampfverbänden SA und SS staatliche Polizeibefugnisse.',
    actors: [
      { name: 'Hermann Göring', role: 'Preußischer Innenminister (kommissarisch)' },
      { name: 'SA', role: 'Parteigebundener Kampfverband' },
      { name: 'SS', role: 'Parteigebundener Kampfverband' },
      { name: 'Preußische Polizei', role: 'Staatliche Ordnungsmacht' },
    ],
    eventsAndMeasures: [
      'Göring setzt SA- und SS-Mitglieder als Hilfspolizisten ein.',
      'Parteigebundene Kampfverbände erhalten staatliche Befugnisse.',
      'Politische Gegner werden verhaftet, eingeschüchtert und misshandelt.',
      'Die Grenze zwischen staatlicher Polizei und nationalsozialistischen Gewaltorganisationen verschwimmt.',
    ],
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
      'Das Berliner Reichstagsgebäude brennt; die NS-Führung nutzt das Ereignis als Vorwand für eine massive Verfolgungswelle.',
    actors: [
      { name: 'Marinus van der Lubbe', role: 'Niederländischer Kommunist, am Brandort festgenommen' },
      { name: 'Adolf Hitler', role: 'Reichskanzler' },
      { name: 'Hermann Göring', role: 'Verantwortlich für polizeiliche Verfolgung' },
    ],
    eventsAndMeasures: [
      'Das Reichstagsgebäude in Berlin brennt.',
      'Der niederländische Kommunist Marinus van der Lubbe wird am Brandort festgenommen.',
      'Die Nationalsozialisten behaupten, der Brand sei Teil eines kommunistischen Umsturzversuchs.',
      'Hitler und Göring nutzen das Ereignis zur Verschärfung der politischen Verfolgung.',
    ],
    contextNotes: [
      'Die tatsächlichen Hintergründe und eine mögliche Beteiligung weiterer Personen sind historisch umstritten.',
    ],
  },
  {
    id: 'reichstagsbrandverordnung',
    indexNumber: '07',
    dateLabel: '28. Februar 1933',
    shortDate: '28. Feb',
    dayOfYear: 59,
    title: 'Reichstagsbrandverordnung',
    officialTitle: 'Verordnung des Reichspräsidenten zum Schutz von Volk und Staat',
    phaseId: 'phase-1',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Auf Grundlage von Artikel 48 der Weimarer Reichsverfassung werden zentrale Grundrechte dauerhaft außer Kraft gesetzt und die „Schutzhaft“ ermöglicht.',
    actors: [
      { name: 'Paul von Hindenburg', role: 'Reichspräsident (Unterzeichnung nach Art. 48)' },
      { name: 'Adolf Hitler', role: 'Reichskanzler' },
      { name: 'Hermann Göring', role: 'Umsetzung in Preußen' },
      { name: 'Wilhelm Frick', role: 'Reichsinnenminister' },
    ],
    eventsAndMeasures: [
      'Hindenburg unterzeichnet die Verordnung auf Grundlage von Artikel 48 der Weimarer Reichsverfassung.',
      'Außerkraftsetzung wesentlicher Grundrechte.',
      'Polizei kann politische Gegner in sogenannte Schutzhaft nehmen.',
      'Hausdurchsuchungen und Beschlagnahmungen werden erleichtert.',
      'Zeitungen und politische Veranstaltungen können verboten werden.',
    ],
    suspendedRights: [
      'Persönliche Freiheit',
      'Meinungsfreiheit',
      'Pressefreiheit',
      'Versammlungsfreiheit',
      'Vereinigungsfreiheit',
      'Brief- und Fernmeldegeheimnis',
    ],
    contextNotes: [
      'Die Verordnung bleibt bis zum Ende des NS-Regimes in Kraft.',
    ],
    image: {
      src: ARCHIVAL_IMAGES.decree,
      alt: 'Archivierte Gesetzestexte und Verordnungen von 1933',
      caption: '28. Februar 1933 · Notverordnung nach Art. 48 WRV als juristisches Fundament des Ausnahmezustands.',
    },
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
      'Unter Bedingungen von Gewalt und Repression erreicht die NSDAP 43,9 % der Stimmen und erlangt gemeinsam mit der DNVP eine parlamentarische Mehrheit.',
    actors: [
      { name: 'NSDAP', role: '43,9 % der Stimmen' },
      { name: 'DNVP', role: 'Koalitionspartner' },
      { name: 'KPD & SPD', role: 'Verfolgte Oppositionsparteien' },
    ],
    eventsAndMeasures: [
      'Die NSDAP erreicht 43,9 % der Stimmen.',
      'Zusammen mit der DNVP verfügt die Regierungskoalition über eine parlamentarische Mehrheit.',
      'Die NSDAP erreicht allein keine absolute Mehrheit.',
      'Der Wahlkampf ist durch Gewalt, Einschüchterung und Einschränkungen der Opposition geprägt.',
      'Zahlreiche kommunistische und sozialdemokratische Politiker werden verfolgt.',
    ],
  },
  {
    id: 'tag-von-potsdam',
    indexNumber: '09',
    dateLabel: '21. März 1933',
    shortDate: '21. Mär',
    dayOfYear: 80,
    title: 'Tag von Potsdam',
    location: 'Potsdamer Garnisonkirche',
    phaseId: 'phase-2',
    mechanism: 'gesellschaft-propaganda',
    mechanismLabel: MECHANISM_LABELS['gesellschaft-propaganda'],
    summary:
      'Propagandistische Inszenierung des Bündnisses zwischen nationalsozialistischer Bewegung und preußisch-konservativer Tradition bei der Eröffnung des neuen Reichstags.',
    actors: [
      { name: 'Adolf Hitler', role: 'Reichskanzler' },
      { name: 'Paul von Hindenburg', role: 'Reichspräsident' },
      { name: 'Franz von Papen', role: 'Vizekanzler' },
      { name: 'NSDAP', role: 'Regierungspartei' },
      { name: 'Konservative Eliten', role: 'Traditionelle Machtträger' },
    ],
    eventsAndMeasures: [
      'Feierliche Eröffnung des neuen Reichstags in der Potsdamer Garnisonkirche.',
      'Hitler tritt demonstrativ respektvoll gegenüber Hindenburg auf.',
      'Inszenierung der Verbindung zwischen nationalsozialistischer Bewegung und preußisch-konservativer Tradition.',
      'Die Veranstaltung wird propagandistisch genutzt, um Vertrauen bei traditionellen gesellschaftlichen Eliten zu gewinnen.',
    ],
  },
  {
    id: 'kz-dachau',
    indexNumber: '10',
    dateLabel: '22. März 1933',
    shortDate: '22. Mär',
    dayOfYear: 81,
    title: 'Erste Häftlinge im Konzentrationslager Dachau',
    location: 'Dachau bei München',
    phaseId: 'phase-2',
    mechanism: 'terror-verfolgung',
    mechanismLabel: MECHANISM_LABELS['terror-verfolgung'],
    summary:
      'Einrichtung des Konzentrationslagers Dachau unter Schutzhaft-Vorwand – es wird zum organisatorischen Vorbild für das spätere Lagersystem.',
    actors: [
      { name: 'Heinrich Himmler', role: 'Aufbau und Leitung im Rahmen von SS und bayerischer Polizei' },
      { name: 'SS', role: 'Wach- und Lagerorganisation' },
      { name: 'Bayerische Polizei', role: 'Beteiligte Behörde' },
    ],
    eventsAndMeasures: [
      'Das Konzentrationslager Dachau wird eingerichtet.',
      'Die ersten Gefangenen treffen ein.',
      'Zu den frühen Häftlingen gehören Kommunisten, Sozialdemokraten und Gewerkschafter.',
      'Die Inhaftierung erfolgt häufig unter dem Vorwand der Schutzhaft.',
    ],
    contextNotes: [
      'Dachau wird zum organisatorischen Vorbild für das spätere Konzentrationslagersystem.',
    ],
  },
  {
    id: 'ermaechtigungsgesetz',
    indexNumber: '11',
    dateLabel: '23. März 1933',
    shortDate: '23. Mär',
    dayOfYear: 82,
    title: 'Ermächtigungsgesetz',
    officialTitle: 'Gesetz zur Behebung der Not von Volk und Reich',
    location: 'Krolloper in Berlin',
    phaseId: 'phase-2',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Mit 444 zu 94 Stimmen überträgt der Reichstag der Reichsregierung das Recht, Gesetze ohne Zustimmung des Parlaments und abweichend von der Verfassung zu erlassen.',
    actors: [
      { name: 'Adolf Hitler', role: 'Reichskanzler' },
      { name: 'Otto Wels', role: 'SPD-Fraktionsvorsitzender' },
      { name: 'Hermann Göring', role: 'Reichstagspräsident' },
      { name: 'Paul von Hindenburg', role: 'Reichspräsident' },
      { name: 'Abgeordnete des Reichstags', role: 'Stimmten in der Krolloper ab' },
    ],
    eventsAndMeasures: [
      'Die Reichsregierung kann Gesetze ohne Zustimmung des Reichstags verabschieden.',
      'Regierungsgesetze dürfen von der Reichsverfassung abweichen.',
      'Die Gesetzgebung wird damit weitgehend von der Regierung übernommen.',
      'Das Gesetz wird zunächst auf vier Jahre befristet.',
    ],
    voteResult: {
      yes: 444,
      no: 94,
      note: 'Die SPD stimmt geschlossen dagegen.',
      details: [
        'Die KPD-Abgeordneten können nicht teilnehmen, da ihre Mandate bereits annulliert wurden.',
        'Zahlreiche SPD-Abgeordnete sind ebenfalls inhaftiert oder an der Teilnahme gehindert.',
      ],
    },
    quotes: [
      {
        speaker: 'Otto Wels (SPD)',
        context: 'Beginn der Rede im Reichstag am 23. März 1933',
        text: '„Meine Damen und Herren! Der außenpolitischen Forderung deutscher Gleichberechtigung, die der Herr Reichskanzler erhoben hat, stimmen wir Sozialdemokraten um so nachdrücklicher zu, als wir sie bereits von jeher grundsätzlich verfochten haben.“',
      },
      {
        speaker: 'Otto Wels (SPD)',
        context: 'Zentrale Aussage der Rede',
        text: '„Freiheit und Leben kann man uns nehmen, die Ehre nicht.“',
      },
    ],
    welsSpeechPoints: [
      'Verteidigung der parlamentarischen Demokratie.',
      'Verteidigung der Meinungs- und Pressefreiheit.',
      'Kritik an der bereits stattfindenden Verfolgung politischer Gegner.',
      'Ablehnung der Selbstentmachtung des Parlaments.',
    ],
    hitlerReplyPoints: [
      'Hitler weist die Kritik von Otto Wels zurück.',
      'Er rechtfertigt die Notwendigkeit einer starken Regierung.',
      'Er stellt die bisherige parlamentarische Ordnung als gescheitert dar.',
      'Er kündigt an, dass die Regierung ihre politischen Ziele unabhängig von parlamentarischen Widerständen durchsetzen werde.',
    ],
    sourceWorkNote:
      'Wichtig für die Quellenarbeit: Die vollständigen Redetexte sollten aus dem stenografischen Reichstagsprotokoll vom 23. März 1933 übernommen werden.',
    image: {
      src: ARCHIVAL_IMAGES.parliament,
      alt: 'Plenarsaal der Abstimmung über das Ermächtigungsgesetz',
      caption: '23. März 1933 · Abstimmung in der Berliner Krolloper: 444 Ja-Stimmen bei 94 Nein-Stimmen der SPD.',
    },
  },
  {
    id: 'gleichschaltung-laender-1',
    indexNumber: '12',
    dateLabel: '31. März 1933',
    shortDate: '31. Mär',
    dayOfYear: 90,
    title: 'Erstes Gesetz zur Gleichschaltung der Länder',
    phaseId: 'phase-2',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Die Zusammensetzung der Landtage wird unter Ausschluss der KPD an das Reichstagswahlergebnis vom 5. März angepasst.',
    actors: [
      { name: 'Reichsregierung', role: 'Gesetzgebende Exekutive' },
      { name: 'Landtage & Landesregierungen', role: 'Gleichgeschaltete Landesorgane' },
    ],
    eventsAndMeasures: [
      'Die Zusammensetzung der Landtage wird an das Ergebnis der Reichstagswahl vom 5. März angepasst.',
      'KPD-Mandate werden nicht berücksichtigt.',
      'Die Länderparlamente verlieren ihre politische Eigenständigkeit.',
      'Die Landesregierungen erhalten zusätzliche Befugnisse.',
    ],
  },
  {
    id: 'gleichschaltung-laender-2',
    indexNumber: '13',
    dateLabel: '7. April 1933',
    shortDate: '07. Apr',
    dayOfYear: 97,
    title: 'Zweites Gesetz zur Gleichschaltung der Länder',
    phaseId: 'phase-2',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Einsetzung von Reichsstatthaltern zur Kontrolle der Landesregierungen – die föderale Ordnung wird weiter ausgehöhlt.',
    actors: [
      { name: 'Reichsstatthalter', role: 'Kontrollinstanz in den Ländern' },
      { name: 'Reichsregierung', role: 'Zentrale Reichsebene' },
    ],
    eventsAndMeasures: [
      'Reichsstatthalter werden in den Ländern eingesetzt.',
      'Sie kontrollieren die Landesregierungen.',
      'Die Reichsregierung erhält stärkeren Einfluss auf die Landespolitik.',
      'Die föderale Ordnung wird weiter eingeschränkt.',
    ],
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
      'Einführung des „Arierparagraphs“ und Entfernung politisch missliebiger sowie jüdischer Beamtinnen und Beamter aus dem Staatsdienst.',
    actors: [
      { name: 'Adolf Hitler', role: 'Reichskanzler' },
      { name: 'Wilhelm Frick', role: 'Reichsinnenminister' },
      { name: 'Reichsinnenministerium', role: 'Zuständiges Ressort' },
      { name: 'Öffentliche Verwaltung', role: 'Betroffener Staatsdienst' },
    ],
    eventsAndMeasures: [
      'Politisch missliebige Beamte können aus dem Staatsdienst entfernt werden.',
      'Jüdische Beamte werden aufgrund ihrer Abstammung grundsätzlich aus dem Staatsdienst gedrängt.',
      'Es gibt zunächst Ausnahmen, insbesondere für bestimmte ehemalige Frontkämpfer des Ersten Weltkriegs.',
      'Der sogenannte Arierparagraph wird eingeführt.',
      'Die Verwaltung wird personell im Sinne der NS-Ideologie umgestaltet.',
    ],
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
      'Erklärung des 1. Mai zum gesetzlichen Feiertag mit Großkundgebungen zur propagandistischen Einbindung der Arbeiterschaft.',
    actors: [
      { name: 'NSDAP / NS-Regime', role: 'Veranstalter der Großkundgebungen' },
      { name: 'Gewerkschaftsvertreter', role: 'Beteiligung an den Feierlichkeiten' },
    ],
    eventsAndMeasures: [
      'Der 1. Mai wird zum gesetzlichen Feiertag erklärt.',
      'Die Nationalsozialisten veranstalten große Kundgebungen.',
      'Gewerkschaftsvertreter beteiligen sich an den Feierlichkeiten.',
      'Das Regime inszeniert sich als Vertreter der deutschen Arbeiterschaft.',
    ],
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
      'Nur einen Tag nach dem 1. Mai besetzen SA und NSBO die Gewerkschaftshäuser, verhaften Gewerkschaftsführer und beschlagnahmen das Vermögen.',
    actors: [
      { name: 'SA', role: 'Besetzung der Gewerkschaftshäuser' },
      { name: 'NSBO', role: 'Nationalsozialistische Betriebszellenorganisation' },
      { name: 'Gewerkschaftsführer', role: 'Verhaftet' },
      { name: 'Deutsche Arbeitsfront (DAF)', role: 'Nachfolgeorganisation' },
    ],
    eventsAndMeasures: [
      'SA und NSBO besetzen Gewerkschaftshäuser.',
      'Gewerkschaftsführer werden verhaftet.',
      'Gewerkschaftsvermögen wird beschlagnahmt.',
      'Freie Gewerkschaften werden zerschlagen.',
      'Die unabhängige Interessenvertretung der Arbeitnehmer wird beseitigt.',
    ],
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
      'Zusammenfassung von Arbeitnehmern und Arbeitgebern unter Robert Ley – bei Abschaffung von Tarifautonomie und Streikrecht.',
    actors: [
      { name: 'Robert Ley', role: 'Leiter der Deutschen Arbeitsfront' },
      { name: 'Deutsche Arbeitsfront (DAF)', role: 'NS-Kontrollorganisation' },
    ],
    eventsAndMeasures: [
      'Unter Robert Ley werden Arbeitnehmer und Arbeitgeber in einer nationalsozialistischen Organisation zusammengefasst.',
      'Die DAF ist keine unabhängige Gewerkschaft.',
      'Tarifautonomie und Streikrecht werden beseitigt.',
      'Die Organisation dient der Kontrolle der Arbeiterschaft.',
    ],
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
      'Öffentliche Verbrennung von Werken jüdischer, marxistischer, pazifistischer und weiterer missliebiger Autorinnen und Autoren zur kulturellen Gleichschaltung.',
    actors: [
      { name: 'Nationalsozialistische Studentenverbände', role: 'Organisatoren der Verbrennungen' },
      { name: 'Erich Kästner', role: 'Verfolgter / verbrannter Autor' },
      { name: 'Heinrich Mann', role: 'Verfolgter / verbrannter Autor' },
      { name: 'Erich Maria Remarque', role: 'Verfolgter / verbrannter Autor' },
      { name: 'Bertolt Brecht', role: 'Verfolgter / verbrannter Autor' },
    ],
    eventsAndMeasures: [
      'Nationalsozialistische Studentenverbände organisieren öffentliche Bücherverbrennungen.',
      'Werke jüdischer, marxistischer, pazifistischer und anderer missliebiger Autoren werden verbrannt.',
      'Betroffen sind unter anderem Erich Kästner, Heinrich Mann, Erich Maria Remarque und Bertolt Brecht.',
      'Die Aktion dient der kulturellen Gleichschaltung.',
    ],
    image: {
      src: ARCHIVAL_IMAGES.library,
      alt: 'Teilweise geleerte Bibliotheksregale',
      caption: '10. Mai 1933 · Kulturelle Gleichschaltung durch Verfolgung und öffentliche Bücherverbrennungen.',
    },
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
      'Offizielles Verbot der Sozialdemokratischen Partei Deutschlands, Beschlagnahmung des Parteivermögens und Verfolgung ihrer Politiker.',
    actors: [
      { name: 'SPD', role: 'Verbotene Oppositionspartei' },
      { name: 'Sozialdemokratische Politiker', role: 'Verfolgt und verhaftet' },
    ],
    eventsAndMeasures: [
      'Die SPD wird offiziell verboten.',
      'Parteivermögen wird beschlagnahmt.',
      'Sozialdemokratische Politiker werden verfolgt und verhaftet.',
      'Die Partei kann nicht mehr legal politisch tätig sein.',
    ],
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
      'Unter massivem politischem Druck lösen sich die Zentrumspartei (5. Juli), die Bayerische Volkspartei und weitere Parteien selbst auf.',
    actors: [
      { name: 'Zentrumspartei', role: 'Selbstauflösung am 5. Juli 1933' },
      { name: 'Bayerische Volkspartei', role: 'Selbstauflösung' },
      { name: 'NSDAP', role: 'Verbleibende einzige politische Kraft' },
    ],
    eventsAndMeasures: [
      'Die Zentrumspartei löst sich am 5. Juli auf.',
      'Die Bayerische Volkspartei löst sich ebenfalls auf.',
      'Weitere Parteien geben unter politischem Druck ihre Tätigkeit auf.',
      'Die NSDAP bleibt als einzige politische Kraft übrig.',
    ],
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
      'Die NSDAP wird gesetzlich zur einzigen politischen Partei erklärt; Neugründung oder Weiterführung anderer Parteien wird unter Strafe gestellt.',
    actors: [
      { name: 'NSDAP', role: 'Gesetzlich einzige politische Partei' },
      { name: 'Reichsregierung', role: 'Gesetzgebung zum Einparteienstaat' },
    ],
    eventsAndMeasures: [
      'Die NSDAP wird gesetzlich zur einzigen politischen Partei erklärt.',
      'Die Gründung neuer Parteien wird verboten.',
      'Wer eine andere Partei unterstützt oder aufrechterhält, macht sich strafbar.',
      'Der Einparteienstaat wird gesetzlich festgeschrieben.',
    ],
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
      'Staatsvertrag zwischen dem Deutschen Reich und dem Vatikan zur Regelung des Verhältnisses zwischen Staat und katholischer Kirche.',
    actors: [
      { name: 'Adolf Hitler', role: 'Reichskanzler' },
      { name: 'Kardinalstaatssekretär Eugenio Pacelli', role: 'Verhandlungsführer des Vatikans' },
      { name: 'Papst Pius XI.', role: 'Oberhaupt der katholischen Kirche' },
    ],
    eventsAndMeasures: [
      'Vertrag zwischen dem Deutschen Reich und dem Vatikan.',
      'Regelungen zum Verhältnis zwischen Staat und katholischer Kirche.',
    ],
    contextNotes: [
      'Hinweis zur Textgrundlage: Dieser Eintrag steht am Ende des vorliegenden Datensammlungs-Manuskripts unter Abschnitt 4 („August–Dezember 1933: Ausbau des Führerstaates“).',
    ],
  },
];

export interface KeyActorDirectoryItem {
  name: string;
  roleSummary: string;
  eventCount: number;
}

export const KEY_ACTORS_DIRECTORY: string[] = [
  'Adolf Hitler',
  'Paul von Hindenburg',
  'Hermann Göring',
  'Franz von Papen',
  'Wilhelm Frick',
  'Otto Wels',
  'Heinrich Himmler',
  'SA',
  'SS',
  'NSDAP',
  'SPD',
  'Alfred Hugenberg',
  'Marinus van der Lubbe',
  'Robert Ley',
];
