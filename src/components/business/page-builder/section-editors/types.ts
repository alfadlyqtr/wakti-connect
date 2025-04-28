
import React from "react";

export interface EditorProps {
  contentData: Record<string, any>;
  handleInputChange: (name: string, value: any) => void;
}
