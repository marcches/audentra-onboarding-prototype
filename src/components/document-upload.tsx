import { FileArrowUpIcon, FilePdfIcon, ImageIcon, TrashIcon } from "@phosphor-icons/react";
import * as React from "react";

import { Notice } from "@/components/notice";
import { Button } from "@/components/ui/button";
import type { UploadedFile } from "@/lib/store";
import { cn } from "@/lib/utils";

const ACCEPTED = ["application/pdf", "image/jpeg", "image/png"];
const ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png";
const MAX_FILES = 8;
const MAX_TOTAL_BYTES = 30 * 1024 * 1024;

type UploadError = "type" | "size" | "total" | "count";

const ERRORS: Record<UploadError, string> = {
  type: "This file type is not accepted. Use PDF, JPEG or PNG.",
  size: "This file is larger than 30 MB.",
  total: "Your files come to more than 30 MB in total. Remove one, or attach a smaller file.",
  count: "You can attach up to 8 files.",
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * A general document upload — the identity upload's drag-and-drop, file list
 * and remove behaviour, minus the simulated OCR read. A medical letter or an
 * immunization record is never "extracted" into a field; it is attached and
 * kept, and that is the whole of what this needs to do.
 */
export function DocumentUpload({
  label,
  hint,
  files,
  onChange,
}: {
  label: string;
  hint: string;
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<UploadError | null>(null);
  const [dragging, setDragging] = React.useState(false);

  const total = files.reduce((sum, file) => sum + file.size, 0);

  function accept(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;
    const list = [...incoming];

    if (files.length + list.length > MAX_FILES) return setError("count");
    if (list.some((file) => !ACCEPTED.includes(file.type))) return setError("type");
    if (list.some((file) => file.size > MAX_TOTAL_BYTES)) return setError("size");
    const nextTotal = total + list.reduce((sum, file) => sum + file.size, 0);
    if (nextTotal > MAX_TOTAL_BYTES) return setError("total");

    const added = list.map((file) => ({ name: file.name, size: file.size }));
    onChange([...files, ...added]);
    setError(null);
  }

  return (
    <div className="space-y-3">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop is an
          enhancement layered on top of the "Choose files" button inside this
          box, which is the keyboard and screen-reader path and is always
          present. */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          accept(event.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-3 rounded-[var(--radius-card)] border-2 border-dashed px-5 py-7 text-center transition-colors",
          dragging ? "border-violet-500 bg-violet-50/60" : "border-ink-200 bg-ink-50/50",
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-[12px] bg-violet-50 text-violet-600">
          <FileArrowUpIcon weight="duotone" aria-hidden className="size-5.5" />
        </span>
        <div className="space-y-1">
          <p className="text-body font-bold text-ink-900">{label}</p>
          <p className="text-small text-ink-500">
            {hint} PDF, JPEG or PNG, up to 8 files, 30 MB in total.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          Choose files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          className="sr-only"
          aria-label={label}
          onChange={(event) => {
            accept(event.target.files);
            // Cleared so re-picking the same file fires `change` again.
            event.target.value = "";
          }}
        />
      </div>

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-[var(--radius-field)] border border-ink-100 bg-surface px-3.5 py-2.5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-ink-50 text-ink-500">
                {file.name.toLowerCase().endsWith(".pdf") ? (
                  <FilePdfIcon weight="duotone" aria-hidden className="size-4.5" />
                ) : (
                  <ImageIcon weight="duotone" aria-hidden className="size-4.5" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-body text-ink-800">{file.name}</span>
                <span className="block text-small text-ink-400">{formatSize(file.size)}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange(files.filter((_, position) => position !== index));
                  setError(null);
                }}
              >
                <TrashIcon aria-hidden className="size-4" />
                Remove
                <span className="sr-only"> {file.name}</span>
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? (
        <Notice alert tone="caution" title="Nothing was lost">
          {ERRORS[error]}
        </Notice>
      ) : null}
    </div>
  );
}
