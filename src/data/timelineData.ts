import berlinStreetImg from '../assets/images/berlin_government_street_1794906912515.jpg';
import unionHouseImg from '../assets/images/berlin_union_house_1794907867054.jpg';
import dachauImg from '../assets/images/dachau_mist_memorial_1794907866226.jpg';
import reichstagImg from '../assets/images/hero_weimar_reichstag_1794822380073.jpg';
import decreeImg from '../assets/images/phase_archival_decree_1794822382633.jpg';
import libraryImg from '../assets/images/phase_memorial_library_1794822382260.jpg';
import parliamentImg from '../assets/images/phase_parliament_chamber_1794822380719.jpg';
import potsdamImg from '../assets/images/potsdam_garrison_church_1794907864151.jpg';
import vaticanImg from '../assets/images/vatican_diplomatic_courtyard_1794907866490.jpg';
import ballotBoxImg from '../assets/images/weimar_ballot_box_1794907865268.jpg';
import printingPressImg from '../assets/images/weimar_printing_press_1794906914540.jpg';

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
  berlinStreet: berlinStreetImg,
  printingPress: printingPressImg,
  potsdam: potsdamImg,
  ballotBox: ballotBoxImg,
  dachau: dachauImg,
  unionHouse: unionHouseImg,
  vatican: vaticanImg,
} as const;

export type BoardPhotoFastener = 'pin' | 'tape';

export interface ContextualBoardPhoto {
  id: string;
  src: string;
  fallbackSrc?: string;
  sourceCredit?: string;
  dateLabel: string;
  caption: string;
  subtitle: string;
  fastener: BoardPhotoFastener;
  tiltDeg: number;
  offsetX: number;
  offsetY: number;
}

export interface BoardPhotoSlot {
  minIndex: number;
  maxIndex: number;
  photo: ContextualBoardPhoto;
}

// Independent left-side photos (distinct authentic 1933 internet photographs with varied heights & staggered pacing)
export const LEFT_BOARD_PHOTOS: BoardPhotoSlot[] = [
  {
    minIndex: 0,
    maxIndex: 1,
    photo: {
      id: 'left-ernennung',
      src: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Bundesarchiv_Bild_102-02985A%2C_Berlin%2C_Fackelzug_zur_Machtergreifung_Hitlers.jpg',
      fallbackSrc: berlinStreetImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 102-02985A',
      dateLabel: '30. Januar 1933',
      caption: 'Wilhelmstraße · Fackelzug zur Machtübertragung',
      subtitle:
        'Am Abend der Ernennung Adolf Hitlers zum Reichskanzler ziehen SA-, SS- und Stahlhelm-Formationen mit Fackeln durch die Berliner Wilhelmstraße.',
      fastener: 'pin',
      tiltDeg: -4.2,
      offsetX: -4,
      offsetY: -158,
    },
  },
  {
    minIndex: 2,
    maxIndex: 3,
    photo: {
      id: 'left-pressezensur-kpd',
      src: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Karl-Liebknecht-Haus_SA.JPG',
      fallbackSrc: printingPressImg,
      sourceCredit: 'Foto: Wikimedia Commons (Berlin, Januar 1933)',
      dateLabel: 'Januar / Februar 1933',
      caption: 'SA vor dem Karl-Liebknecht-Haus in Berlin',
      subtitle:
        'Schon Anfang 1933 richtet sich der Druck von Notverordnungen und SA-Aufmärschen gezielt gegen Versammlungen, Zeitungen und Zentralen der Arbeiterparteien.',
      fastener: 'tape',
      tiltDeg: 2.6,
      offsetX: 6,
      offsetY: -28,
    },
  },
  {
    minIndex: 4,
    maxIndex: 5,
    photo: {
      id: 'left-hilfspolizei',
      src: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Bundesarchiv_Bild_102-02974A%2C_Berlin%2C_SA_als_Hilfspolizei.jpg',
      fallbackSrc: berlinStreetImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 102-02974A',
      dateLabel: 'Ab 22. Februar 1933',
      caption: 'SA-Formationen als preußische Hilfspolizei',
      subtitle:
        'Per Erlass Hermann Görings werden rund 50.000 SA-, SS- und Stahlhelm-Männer mit staatlichen Polizeibefugnissen und Waffen ausgestattet.',
      fastener: 'pin',
      tiltDeg: -3.6,
      offsetX: -4,
      offsetY: -152,
    },
  },
  {
    minIndex: 6,
    maxIndex: 7,
    photo: {
      id: 'left-polizei-wahltag',
      src: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Bundesarchiv_Bild_102-14381%2C_Berlin%2C_Polizeipatrouille_am_Wahltag.jpg',
      fallbackSrc: ballotBoxImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 102-14381',
      dateLabel: '5. März 1933',
      caption: 'Polizeipatrouille am Wahltag in Berlin',
      subtitle:
        'Auf Basis der Notverordnung vom 28. Februar kontrollieren Polizei und Hilfspolizei am Tag der Reichstagswahl Straßen und Wahllokale.',
      fastener: 'tape',
      tiltDeg: 2.9,
      offsetX: 5,
      offsetY: -20,
    },
  },
  {
    minIndex: 8,
    maxIndex: 9,
    photo: {
      id: 'left-potsdam',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Bundesarchiv_Bild_183-S38324%2C_Tag_von_Potsdam%2C_Adolf_Hitler%2C_Paul_v._Hindenburg.jpg/960px-Bundesarchiv_Bild_183-S38324%2C_Tag_von_Potsdam%2C_Adolf_Hitler%2C_Paul_v._Hindenburg.jpg',
      fallbackSrc: potsdamImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 183-S38324',
      dateLabel: '21. März 1933',
      caption: 'Garnisonkirche · Tag von Potsdam',
      subtitle:
        'Bei der feierlichen Eröffnung des neuen Reichstags inszeniert Hitler mit Hindenburg den Schulterschluss zwischen NS-Regime und altem Preußentum.',
      fastener: 'pin',
      tiltDeg: -2.4,
      offsetX: 7,
      offsetY: -18,
    },
  },
  {
    minIndex: 10,
    maxIndex: 12,
    photo: {
      id: 'left-krolloper',
      src: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Bundesarchiv_Bild_183-U0613-504%2C_Berlin%2C_Krolloper.jpg',
      fallbackSrc: parliamentImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 183-U0613-504',
      dateLabel: 'Ab März 1933',
      caption: 'Krolloper Berlin · Tagungsort des Reichstags',
      subtitle:
        'Nach dem Brand des Reichstagsgebäudes tagt das Parlament in der Krolloper – dort verabschiedet es am 23. März 1933 das Ermächtigungsgesetz.',
      fastener: 'pin',
      tiltDeg: -3.5,
      offsetX: -4,
      offsetY: -160,
    },
  },
  // Index 13 intentionally has NO left photo (only right stays pinned)
  {
    minIndex: 14,
    maxIndex: 14,
    photo: {
      id: 'left-pacelli-rom',
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Pius_XII%2C_Papst.jpg/960px-Pius_XII%2C_Papst.jpg',
      fallbackSrc: vaticanImg,
      sourceCredit: 'Foto: Wikimedia Commons (Eugenio Pacelli)',
      dateLabel: 'Ab April 1933',
      caption: 'Kardinalstaatssekretär Eugenio Pacelli (Vatikan)',
      subtitle:
        'Pacelli führt für den Vatikan ab April 1933 die Konkordatsverhandlungen mit Papen und Prälat Kaas – Schutzgarantien für die Kirche gegen Rückzug aus der Parteipolitik.',
      fastener: 'pin',
      tiltDeg: -2.8,
      offsetX: 5,
      offsetY: -18,
    },
  },
  {
    minIndex: 15,
    maxIndex: 16,
    photo: {
      id: 'left-lustgarten-mai',
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Bundesarchiv_Bild_102-15783%2C_Berlin%2C_Lustgarten%2C_Maikundgebung.jpg',
      fallbackSrc: unionHouseImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 102-15783',
      dateLabel: '1. Mai 1933',
      caption: 'Berliner Lustgarten · „Tag der nationalen Arbeit“',
      subtitle:
        'Hunderttausende werden zu den NS-Maifeiern mobilisiert – nur einen Tag vor der gewaltsamen Besetzung und Zerschlagung aller Gewerkschaftshäuser.',
      fastener: 'pin',
      tiltDeg: 3.1,
      offsetX: 5,
      offsetY: -50,
    },
  },
  {
    minIndex: 17,
    maxIndex: 19,
    photo: {
      id: 'left-buecher',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bundesarchiv_Bild_102-14597%2C_Berlin%2C_Opernplatz%2C_B%C3%BCcherverbrennung.jpg/960px-Bundesarchiv_Bild_102-14597%2C_Berlin%2C_Opernplatz%2C_B%C3%BCcherverbrennung.jpg',
      fallbackSrc: libraryImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 102-14597',
      dateLabel: '10. Mai 1933',
      caption: 'Opernplatz · Bücherverbrennungen',
      subtitle:
        'NS-Studentenverbände verbrennen öffentlich Werke jüdischer, sozialistischer und demokratischer Autorinnen und Autoren als „undeutsch“.',
      fastener: 'pin',
      tiltDeg: -4.1,
      offsetX: -5,
      offsetY: -164,
    },
  },
  {
    minIndex: 20,
    maxIndex: 21,
    photo: {
      id: 'left-einparteienstaat',
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Bundesarchiv_Bild_102-00800%2C_Berlin%2C_Reichstag%2C_Er%C3%B6ffnungssitzung.jpg',
      fallbackSrc: parliamentImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 102-00800',
      dateLabel: '1933',
      caption: 'Gleichgeschalteter Einparteien-Reichstag',
      subtitle:
        'Nach dem Verbot der SPD, der Selbstauflösung der bürgerlichen Parteien und dem Gesetz vom 14. Juli 1933 beherrscht allein die NSDAP das Parlament.',
      fastener: 'pin',
      tiltDeg: -2.2,
      offsetX: 6,
      offsetY: -18,
    },
  },
  // Index 22 intentionally has NO left photo so the Konkordat signing photo stands out on the right
  {
    minIndex: 23,
    maxIndex: 23,
    photo: {
      id: 'left-klausener-1934',
      src: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Bundesarchiv_Bild_102-14315%2C_Erich_Klausener.jpg',
      fallbackSrc: vaticanImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 102-14315',
      dateLabel: '1933 / 30. Juni 1934',
      caption: 'Erich Klausener · Leiter der Katholischen Aktion',
      subtitle:
        'Trotz des Reichskonkordats werden katholische Verbände ab 1933/34 massiv unter Druck gesetzt; Erich Klausener wird am 30. Juni 1934 ermordet.',
      fastener: 'pin',
      tiltDeg: -3.0,
      offsetX: 5,
      offsetY: -24,
    },
  },
];

// Independent right-side photos (distinct authentic 1933 internet photographs + staggered shifts)
export const RIGHT_BOARD_PHOTOS: BoardPhotoSlot[] = [
  // Index 0 intentionally has NO right photo yet
  {
    minIndex: 1,
    maxIndex: 2,
    photo: {
      id: 'right-kabinett',
      src: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Bundesarchiv_Bild_183-H28422%2C_Reichskabinett_Adolf_Hitler.jpg',
      fallbackSrc: parliamentImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 183-H28422',
      dateLabel: '30. Jan / 1. Feb 1933',
      caption: 'Kabinett Hitler & Reichstagsauflösung',
      subtitle:
        'Die neue Rechtskoalition mit Vizekanzler von Papen und DNVP-Chef Hugenberg löst umgehend den Reichstag auf, um Neuwahlen unter Druck anzusetzen.',
      fastener: 'tape',
      tiltDeg: 3.3,
      offsetX: 5,
      offsetY: -18,
    },
  },
  {
    minIndex: 3,
    maxIndex: 4,
    photo: {
      id: 'right-razzia-scheunenviertel',
      src: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bundesarchiv_Bild_102-02940A%2C_Berlin%2C_Polizei-Einsatz_im_Scheunenviertel.jpg',
      fallbackSrc: berlinStreetImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 102-02940A',
      dateLabel: 'Februar 1933',
      caption: 'Polizeirazzia in Berlin · Druck auf Gegner',
      subtitle:
        'Mit Millionenmitteln aus der Wirtschaft und wachsender Polizeigewalt verstärken NSDAP und Staatsapparat im Februar 1933 Razzien und Einschüchterung.',
      fastener: 'tape',
      tiltDeg: -2.7,
      offsetX: -5,
      offsetY: -26,
    },
  },
  {
    minIndex: 5,
    maxIndex: 6,
    photo: {
      id: 'right-reichstagsbrand',
      src: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Bundesarchiv_Bild_183-R99859%2C_Berlin%2C_brennender_Reichstag_%28Reichstagsbrand%29.jpg',
      fallbackSrc: reichstagImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 183-R99859',
      dateLabel: '27. / 28. Februar 1933',
      caption: 'Brennender Reichstag · Vorwand für Art. 48',
      subtitle:
        'Der Reichstagsbrand liefert der NS-Führung den Vorwand für die Notverordnung vom 28. Februar, die zentrale Grundrechte dauerhaft außer Kraft setzt.',
      fastener: 'pin',
      tiltDeg: 4.2,
      offsetX: -4,
      offsetY: -164,
    },
  },
  {
    minIndex: 7,
    maxIndex: 8,
    photo: {
      id: 'right-wahlplakat',
      src: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Bundesarchiv_Bild_102-15183%2C_Wahlplakat_der_NSDAP_zur_Reichstagswahl.jpg',
      fallbackSrc: ballotBoxImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 102-15183',
      dateLabel: '5. März 1933',
      caption: 'NSDAP-Wahlpropaganda zur Reichstagswahl',
      subtitle:
        'Trotz massiver Wahlpropaganda, Zeitungsverboten und Terror gegen KPD und SPD verfehlt die NSDAP am 5. März mit 43,9 % die absolute Mehrheit.',
      fastener: 'pin',
      tiltDeg: 4.1,
      offsetX: 4,
      offsetY: -156,
    },
  },
  {
    minIndex: 9,
    maxIndex: 9,
    photo: {
      id: 'right-dachau',
      src: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Bundesarchiv_Bild_152-01-14%2C_Dachau%2C_Konzentrationslager_1933.jpg',
      fallbackSrc: dachauImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 152-01-14',
      dateLabel: '22. März 1933',
      caption: 'KZ Dachau · Frühe Häftlinge 1933',
      subtitle:
        'Unmittelbar nach Errichtung des Lagers Dachau werden politische Gegner ohne Gerichtsurteil in „Schutzhaft“ verschleppt.',
      fastener: 'pin',
      tiltDeg: -3.2,
      offsetX: -5,
      offsetY: -44,
    },
  },
  {
    minIndex: 10,
    maxIndex: 11,
    photo: {
      id: 'right-ermaechtigung',
      src: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Bundesarchiv_Bild_102-14439%2C_Rede_Adolf_Hitlers_zum_Erm%C3%A4chtigungsgesetz.jpg',
      fallbackSrc: parliamentImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 102-14439',
      dateLabel: '23. März 1933',
      caption: 'Krolloper · Rede zum Ermächtigungsgesetz',
      subtitle:
        'Hitler spricht in der von SA und SS bewachten Krolloper für das Ermächtigungsgesetz – der Reichstag stimmt seiner Selbstentmachtung zu.',
      fastener: 'pin',
      tiltDeg: 3.1,
      offsetX: -5,
      offsetY: -14,
    },
  },
  {
    minIndex: 12,
    maxIndex: 12,
    photo: {
      id: 'right-presseempfang',
      src: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Bundesarchiv_Bild_102-14492%2C_Berlin%2C_Presseempfang_mit_Goebbels_und_Hitler.jpg',
      fallbackSrc: decreeImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 102-14492',
      dateLabel: 'April 1933',
      caption: 'Gleichschaltung von Staat & Öffentlichkeit',
      subtitle:
        'Parallel zur Entmachtung der Länder durch Reichsstatthalter lenkt das neue Propagandaministerium unter Goebbels Presse und öffentliche Meinung.',
      fastener: 'tape',
      tiltDeg: 3.7,
      offsetX: 4,
      offsetY: -158,
    },
  },
  {
    minIndex: 13,
    maxIndex: 13,
    photo: {
      id: 'right-boykott-berufsbeamtentum',
      src: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Bundesarchiv_Bild_183-R70355%2C_Berlin%2C_Boykott_j%C3%BCdischer_Gesch%C3%A4fte.jpg',
      fallbackSrc: decreeImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 183-R70355',
      dateLabel: 'April 1933',
      caption: 'Ausgrenzung & „Arierparagraph“',
      subtitle:
        'Auf den reichsweiten April-Boykott folgt am 7. April das Berufsbeamtengesetz: Jüdische und demokratische Staatsdiener werden aus dem Amt gedrängt.',
      fastener: 'tape',
      tiltDeg: -3.1,
      offsetX: -4,
      offsetY: -154,
    },
  },
  {
    minIndex: 14,
    maxIndex: 14,
    photo: {
      id: 'right-papen-rom',
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Bundesarchiv_Bild_183-1988-0113-500%2C_Franz_v._Papen_%28cropped%29.jpg/960px-Bundesarchiv_Bild_183-1988-0113-500%2C_Franz_v._Papen_%28cropped%29.jpg',
      fallbackSrc: decreeImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 183-1988-0113-500',
      dateLabel: '8.–18. April 1933',
      caption: 'Franz von Papen · Verhandlungsführer in Rom',
      subtitle:
        'Als katholischer Vizekanzler handelt Papen im Vatikan das Konkordat aus – das Regime sucht außenpolitische Anerkennung und die Ausschaltung des politischen Katholizismus.',
      fastener: 'tape',
      tiltDeg: 3.1,
      offsetX: -4,
      offsetY: -152,
    },
  },
  {
    minIndex: 15,
    maxIndex: 16,
    photo: {
      id: 'right-mai-hindenburg-hitler',
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/3_1_0_17_12495_3_1_34564_Erster_Mai_Der_Feiertag_der_nationalen_Arbeit_May_Day_Celebrations_Berlin_Nazi_Germany_1933-05-01_President_von_Hindenburg%2C_Reich_Chancellor_Hitler_in_car_arrive_to_ceremony_%28R_Sennecke%29_NAC_Public_domain.jpg/960px-thumbnail.jpg',
      fallbackSrc: berlinStreetImg,
      sourceCredit: 'Foto: Narodowe Archiwum Cyfrowe (NAC), 1. Mai 1933',
      dateLabel: '1. Mai 1933',
      caption: 'Hindenburg & Hitler am 1. Mai in Berlin',
      subtitle:
        'Zur Großkundgebung am „Tag der nationalen Arbeit“ fahren Reichspräsident und Reichskanzler gemeinsam vor – tags darauf zerschlägt die SA die Gewerkschaften.',
      fastener: 'tape',
      tiltDeg: 2.6,
      offsetX: 5,
      offsetY: -20,
    },
  },
  {
    minIndex: 17,
    maxIndex: 18,
    photo: {
      id: 'right-ley-daf',
      src: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Bundesarchiv_Bild_183-2008-0922-501%2C_Robert_Ley.jpg',
      fallbackSrc: printingPressImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 183-2008-0922-501',
      dateLabel: '10. Mai 1933',
      caption: 'Robert Ley · Leiter der DAF',
      subtitle:
        'Robert Ley übernimmt die Führung der Deutschen Arbeitsfront (DAF), die enteignete Gewerkschaften ersetzt und Streikrecht sowie Tarifautonomie abschafft.',
      fastener: 'tape',
      tiltDeg: -3.2,
      offsetX: 6,
      offsetY: -22,
    },
  },
  {
    minIndex: 19,
    maxIndex: 20,
    photo: {
      id: 'right-wels-spd',
      src: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Bundesarchiv_Bild_102-13200%2C_Otto_Wels.jpg',
      fallbackSrc: unionHouseImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 102-13200',
      dateLabel: '22. Juni 1933',
      caption: 'Otto Wels & das Verbot der SPD',
      subtitle:
        'Nach dem mutigen Nein ihres Vorsitzenden Otto Wels zum Ermächtigungsgesetz wird die SPD im Juni 1933 verboten; ihre Führung flieht ins Prager Exil.',
      fastener: 'tape',
      tiltDeg: 2.8,
      offsetX: -5,
      offsetY: -64,
    },
  },
  // Index 21 empty on right while Einparteien-Reichstag hangs on left
  {
    minIndex: 22,
    maxIndex: 22,
    photo: {
      id: 'right-konkordat',
      src: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Bundesarchiv_Bild_183-R24391%2C_Konkordatsunterzeichnung_in_Rom.jpg',
      fallbackSrc: vaticanImg,
      sourceCredit: 'Foto: Bundesarchiv, Bild 183-R24391',
      dateLabel: '20. Juli 1933',
      caption: 'Unterzeichnung des Reichskonkordats',
      subtitle:
        'Kardinalstaatssekretär Pacelli und Vizekanzler von Papen unterzeichnen in Rom das Reichskonkordat – ein diplomatischer Erfolg für das NS-Regime bei gleichzeitiger Entpolitisierung des Klerus.',
      fastener: 'tape',
      tiltDeg: 3.4,
      offsetX: -4,
      offsetY: -158,
    },
  },
];

export interface ContextualGlossaryNote {
  id: string;
  term: string;
  shortTag: string;
  definition: string;
  eventLabel: string;
  fastener: BoardPhotoFastener;
  tiltDeg: number;
  offsetX: number;
  offsetY: number;
}

export interface BoardGlossarySlot {
  side: 'left' | 'right';
  minIndex: number;
  maxIndex: number;
  note: ContextualGlossaryNote;
}

// Contextual term sticky-notes pinned directly beside relevant timeline stations
// offsetY values are calibrated to avoid colliding with FlankingPinboardPhoto on the same wing
export const BOARD_GLOSSARY_NOTES: BoardGlossarySlot[] = [
  {
    side: 'left',
    minIndex: 2,
    maxIndex: 2,
    note: {
      id: 'term-notverordnung',
      term: 'Notverordnung',
      shortTag: 'Verfassungsrecht',
      eventLabel: '04. Februar 1933 · Einschränkung von Presse & Versammlung',
      definition:
        'Eine vom Reichspräsidenten ohne vorherigen Parlamentsbeschluss erlassene Verordnung. Hitler nutzte Notverordnungen Hindenburgs ab Februar 1933, um Grundrechte und Opposition noch vor den Wahlen zu beschneiden.',
      fastener: 'tape',
      tiltDeg: -3.2,
      offsetX: -3,
      offsetY: -188,
    },
  },
  {
    side: 'right',
    minIndex: 6,
    maxIndex: 6,
    note: {
      id: 'term-art48',
      term: 'Art. 48 WRV',
      shortTag: 'Weimarer Reichsverfassung',
      eventLabel: '28. Februar 1933 · Reichstagsbrandverordnung',
      definition:
        'Der „Diktaturartikel“ der Weimarer Verfassung erlaubte dem Reichspräsidenten im Notfall Grundrechte auszusetzen. Die NS-Führung nutzte ihn als Hebel, um den Ausnahmezustand auf Dauer zu stellen.',
      fastener: 'pin',
      tiltDeg: 3.4,
      offsetX: 4,
      offsetY: -14,
    },
  },
  {
    side: 'right',
    minIndex: 9,
    maxIndex: 9,
    note: {
      id: 'term-schutzhaft',
      term: '„Schutzhaft“',
      shortTag: 'Willkürterror',
      eventLabel: '22. März 1933 · Erste Häftlinge im KZ Dachau',
      definition:
        'Beschönigender NS-Begriff für unbefristete Festnahmen und Verschleppung ins Konzentrationslager durch Polizei, SA oder SS – ohne Haftbefehl, ohne Anklage und ohne richterliche Kontrolle.',
      fastener: 'pin',
      tiltDeg: -3.1,
      offsetX: 3,
      offsetY: -214,
    },
  },
  {
    side: 'left',
    minIndex: 10,
    maxIndex: 10,
    note: {
      id: 'term-scheinlegalitaet',
      term: 'Scheinlegalität',
      shortTag: 'Machtstrategie',
      eventLabel: '23. März 1933 · Ermächtigungsgesetz',
      definition:
        'Das NS-Regime kleidete den Sturz der Demokratie bewusst in formale Gesetze und Verordnungen. So blieben viele Beamte, Richter und konservative Eliten loyal – obwohl vorher Terror und Einschüchterung das Ergebnis erzwangen.',
      fastener: 'tape',
      tiltDeg: 2.8,
      offsetX: 3,
      offsetY: -14,
    },
  },
  {
    side: 'left',
    minIndex: 11,
    maxIndex: 12,
    note: {
      id: 'term-gleichschaltung',
      term: 'Gleichschaltung',
      shortTag: 'Herrschaftsprinzip',
      eventLabel: 'März / April 1933 · Entmachtung der Länder',
      definition:
        'Die systematische Unterwerfung von Ländern, Verbänden, Justiz, Kultur und Gesellschaft unter die Kontrolle der NSDAP. Eigenständige Gegenkräfte wurden aufgelöst oder durch NS-Organisationen ersetzt.',
      fastener: 'pin',
      tiltDeg: -2.9,
      offsetX: 2,
      offsetY: -14,
    },
  },
  {
    side: 'left',
    minIndex: 13,
    maxIndex: 13,
    note: {
      id: 'term-arierparagraph',
      term: '„Arierparagraph“',
      shortTag: 'Rassistischer Ausschluss',
      eventLabel: '07. April 1933 · Berufsbeamtengesetz',
      definition:
        'Gesetzliche Klausel, mit der jüdische sowie politisch missliebige Beamtinnen und Beamte aus dem öffentlichen Dienst entlassen wurden – der Beginn staatlich verordneter Ausgrenzung im Berufsleben.',
      fastener: 'tape',
      tiltDeg: -2.6,
      offsetX: 2,
      offsetY: -86,
    },
  },
  {
    side: 'right',
    minIndex: 21,
    maxIndex: 21,
    note: {
      id: 'term-einparteienstaat',
      term: 'Einparteienstaat',
      shortTag: 'Diktatursicherung',
      eventLabel: '14. Juli 1933 · Gesetz gegen Neubildung von Parteien',
      definition:
        'Politische Ordnung, in der nur noch eine einzige Partei zugelassen ist. Ab dem 14. Juli 1933 war die NSDAP die einzige erlaubte Partei; jede andere politische Organisation wurde unter Strafe gestellt.',
      fastener: 'pin',
      tiltDeg: 3.1,
      offsetX: -2,
      offsetY: -92,
    },
  },
  {
    side: 'left',
    minIndex: 22,
    maxIndex: 22,
    note: {
      id: 'term-reichskonkordat',
      term: 'Reichskonkordat',
      shortTag: 'Kirchenpolitik & Vatikan',
      eventLabel: '20. Juli 1933 · Vertrag mit dem Vatikan',
      definition:
        'Völkerrechtlicher Vertrag zwischen dem Deutschen Reich und dem Heiligen Stuhl: Der Vatikan erhielt Zusagen für katholische Schulen und Seelsorge, während Geistliche aus Parteipolitik ausschieden und das NS-Regime internationale Anerkennung gewann.',
      fastener: 'tape',
      tiltDeg: -2.4,
      offsetX: 2,
      offsetY: -92,
    },
  },
];

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
      details: [
        'KPD ausgeschlossen; SPD-Abgeordnete teilweise inhaftiert.',
        'Bürgerliche Parteien wie das katholische Zentrum stimmen nach Hitlers Zusagen (u. a. zum Schutz der Kirchen) zu.',
      ],
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
    contextNotes: [
      'Hitlers Versprechen in der Reichstagsrede, Rechte der Kirchen zu achten, trägt zur Zustimmung der Zentrumspartei bei – kurz darauf beginnen die Konkordatsgespräche in Rom.',
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
    id: 'konkordatsverhandlungen-rom',
    indexNumber: '15',
    dateLabel: '8.–18. April 1933',
    shortDate: '08.–18. Apr',
    dayOfYear: 98,
    title: 'Konkordatsgespräche im Vatikan',
    location: 'Vatikan / Rom',
    phaseId: 'phase-2',
    mechanism: 'staat-recht',
    mechanismLabel: MECHANISM_LABELS['staat-recht'],
    summary:
      'Vizekanzler von Papen und Zentrumschef Ludwig Kaas verhandeln im Vatikan über ein Reichskonkordat – Schutz für die Kirche gegen Rückzug aus der Politik.',
    actors: [
      {
        name: 'Eugenio Pacelli',
        role: 'Kardinalstaatssekretär',
        action:
          'Führt die Gespräche für den Vatikan und verlangt rechtliche Garantien für Seelsorge, Orden und katholische Bekenntnisschulen.',
      },
      {
        name: 'Franz von Papen',
        role: 'Vizekanzler',
        action:
          'Reist nach Rom, um dem NS-Regime außenpolitische Anerkennung zu sichern und den politischen Katholizismus auszuschalten.',
      },
      {
        name: 'Ludwig Kaas',
        role: 'Zentrumspartei / Prälat',
        action:
          'Wirkt als ehemaliger Zentrumsvorsitzender in Rom am Vertragsentwurf mit – seine Partei verliert dadurch ihren politischen Rückhalt.',
      },
      {
        name: 'Adolf Hitler',
        role: 'Reichskanzler',
        action:
          'Nutzt die Verhandlungen gezielt, um katholischen Widerstand zu neutralisieren und internationale Akzeptanz zu gewinnen.',
      },
    ],
    eventsAndMeasures: [
      'Vatikan will kirchliche Institutionen und Schulen vor Gleichschaltung schützen.',
      'NS-Regime fordert im Gegenzug ein Verbot parteipolitischer Betätigung für Geistliche (später Art. 32).',
    ],
    contextNotes: [
      'Bezug zur Leitfrage: Durch das Einbinden des Vatikans entzieht die NS-Führung der demokratischen Zentrumspartei die kirchliche Stütze und ebnet deren Selbstauflösung (5. Juli) den Weg.',
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
    institutionNote: 'Geheimverhandlungen in Rom: Kirchliche Zusagen sollen mit politischer Zurückhaltung bezahlt werden.',
  },
  {
    id: 'tag-der-nationalen-arbeit',
    indexNumber: '16',
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
    indexNumber: '17',
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
    indexNumber: '18',
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
    indexNumber: '19',
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
    indexNumber: '20',
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
    indexNumber: '21',
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
          'Löst sich am 5. Juli 1933 als letzte bürgerliche Partei unter Druck und im Zuge der Konkordatsverhandlungen mit dem Vatikan selbst auf.',
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
    contextNotes: [
      'Direkte Verbindung zum Vatikan: Erst die Aussicht auf das Reichskonkordat (inkl. Verbot parteipolitischer Arbeit für Geistliche) bewegt die Zentrumspartei am 5. Juli zur endgültigen Aufgabe.',
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
    institutionNote: 'Bürgerliche Parteien lösen sich unter Druck und Konkordats-Verhandlungen selbst auf.',
  },
  {
    id: 'einparteienstaat-gesetz',
    indexNumber: '22',
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
    indexNumber: '23',
    dateLabel: '20. Juli 1933',
    shortDate: '20. Jul',
    dayOfYear: 201,
    title: 'Reichskonkordat mit dem Vatikan',
    location: 'Vatikan / Rom',
    phaseId: 'phase-4',
    mechanism: 'gesellschaft-propaganda',
    mechanismLabel: MECHANISM_LABELS['gesellschaft-propaganda'],
    summary:
      'Der erste völkerrechtliche Vertrag des NS-Regimes bringt internationale Anerkennung und besiegelt die politische Entmachtung des deutschen Katholizismus.',
    actors: [
      {
        name: 'Adolf Hitler',
        role: 'Reichskanzler',
        action:
          'Gewinnt durch das Konkordat erstmals internationale Vertragsfähigkeit und neutralisiert katholische Opposition im Innern.',
      },
      {
        name: 'Eugenio Pacelli',
        role: 'Kardinalstaatssekretär',
        action:
          'Unterzeichnet den Vertrag für den Vatikan – er hofft auf Rechtssicherheit für Kirche, Orden und Schulen, akzeptiert aber das Politikverbot für Geistliche.',
      },
      {
        name: 'Franz von Papen',
        role: 'Vizekanzler',
        action:
          'Setzt seine Unterschrift für das Deutsche Reich neben Pacelli und feiert das Abkommen als Erfolg der Regierung.',
      },
      {
        name: 'Papst Pius XI.',
        role: 'Vatikan',
        action:
          'Genehmigt den völkerrechtlichen Vertrag zur Absicherung von Seelsorge und Konfessionsschulen in Deutschland.',
      },
    ],
    eventsAndMeasures: [
      'Außenpolitische Aufwertung: Erster bilateraler Staatsvertrag Hitlers durchbricht die internationale Isolation nach Terror und Parteiverboten.',
      'Artikel 32 („Entpolitisierung“): Verbietet Geistlichen und Ordensleuten jede parteipolitische Betätigung.',
      'Schein-Garantien für katholische Vereine und Schulen sollen gläubige Katholiken an den neuen Staat binden.',
    ],
    contextNotes: [
      'Bezug zur Leitfrage: Während Parlament, Parteien und Gewerkschaften ausgeschaltet sind, sichert der Vertrag mit dem Vatikan die Diktatur diplomatisch nach außen und befriedet kirchliche Gegenkräfte im Innern.',
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
    institutionNote: 'Politischer Katholizismus ist neutralisiert; das Konkordat legitimiert das Regime nach außen.',
  },
  {
    id: 'konkordatsbruch-1934',
    indexNumber: '24',
    dateLabel: 'Herbst 1933 – 30. Juni 1934',
    shortDate: '1933–34',
    dayOfYear: 365,
    title: 'Konkordatsbruch & Druck auf katholische Verbände',
    location: 'Deutsches Reich / Vatikan',
    phaseId: 'phase-4',
    mechanism: 'terror-verfolgung',
    mechanismLabel: MECHANISM_LABELS['terror-verfolgung'],
    summary:
      'Nach der Herrschaftssicherung bricht das NS-Regime zentrale Zusagen des Reichskonkordats und geht mit Gleichschaltungsdruck und Terror gegen katholische Organisationen vor.',
    actors: [
      {
        name: 'Erich Klausener',
        role: 'Katholische Aktion',
        action:
          'Leitet die Katholische Aktion in Berlin und hält an eigenständigem Verbandsleben fest – am 30. Juni 1934 wird er im „Röhm-Putsch“ von der SS ermordet.',
      },
      {
        name: 'Eugenio Pacelli',
        role: 'Vatikan / Proteste',
        action:
          'Legt in zahlreichen diplomatischen Protestnoten vergeblich Widerspruch gegen Vertragsbrüche, Presseverbote und Verhaftungen von Geistlichen ein.',
      },
      {
        name: 'Adolf Hitler',
        role: 'Reichskanzler',
        action:
          'Hält Konkordatsversprechen nur so lange ein, wie es der Machtfestigung dient, und beansprucht danach das Monopol über Jugend und Gesellschaft.',
      },
      {
        name: 'SS',
        role: 'Verfolgung 1934',
        action:
          'Schüchtert katholische Vereine und Verlage ein und ermordet am 30. Juni 1934 auch prominente katholische Laienführer (Erich Klausener, Adalbert Probst).',
      },
    ],
    eventsAndMeasures: [
      'Aushöhlung des Konkordats: Beschränkung katholischer Jugendverbände (Verbot von Doppelmitgliedschaften zur HJ), Zensur der Kirchenpresse und Druck auf Bekenntnisschulen.',
      'Am 30. Juni 1934 („Röhm-Putsch“) werden neben SA-Führern auch führende Katholiken wie Erich Klausener und Adalbert Probst ermordet.',
      'Vatikanische Protestnoten bleiben wirkungslos (1937 folgt die kritische Enzyklika „Mit brennender Sorge“).',
    ],
    contextNotes: [
      'Bezug zur Leitfrage: Das Beispiel des Vatikans zeigt das doppelte Muster der NS-Herrschaftssicherung – 1933 Legitimation und Täuschung per Vertrag, 1933/34 schrittweiser Bruch der Zusagen nach innen.',
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
    institutionNote: 'Alle demokratischen Gegenkräfte sind zerstört; selbst Konkordatsgarantien für die Kirche werden ab 1933/34 gebrochen.',
  },
];
