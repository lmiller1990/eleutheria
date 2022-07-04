export interface SongInfoPanelProps {
  noteCount?: number;
  duration?: string;
  bpm?: number;
  personalBest?: string;
  highlightColor?: string;
  data: TableCell[];
}

export interface TableCell {
  title: string;
  content: string | number;
}
