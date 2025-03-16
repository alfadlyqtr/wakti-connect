
import { ChangeEvent } from "react";

export interface EditorProps {
  contentData: Record<string, any>;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}
