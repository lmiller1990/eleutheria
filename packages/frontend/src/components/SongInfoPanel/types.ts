export interface SongInfoPanelProps {
  highlightColor?: string;
  data: TableCell[];
}

export interface TableCell {
  title: string;
  content: string | number;
}
