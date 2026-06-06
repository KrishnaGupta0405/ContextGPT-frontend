"use client";

import { getToolBySlug } from "../../_config/tools.config";
import FileToMarkdownTool from "../_components/FileToMarkdownTool";

const tool = getToolBySlug("convert-pdf-to-markdown");

export default function ConvertPdfToMarkdown() {
  return <FileToMarkdownTool tool={tool} />;
}
