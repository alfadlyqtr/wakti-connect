
import React from "react";

export interface EditorProps {
  contentData: Record<string, any>;
  handleInputChange: (nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: any) => void;
}
