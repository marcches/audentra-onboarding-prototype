import { FileArrowUpIcon, FilePdfIcon, ImageIcon, TrashIcon } from "@phosphor-icons/react";
import * as React from "react";

import { Notice } from "@/components/notice";
import { IconTile } from "@/components/surfaces";
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
  tall = false,
  files,
  onChange,
}: {
  label: string;
  /**
   * Optional. Where the label already says what the file is, this line was
   * repeating it — the format-and-limits sentence below is the part that
   * genuinely cannot be guessed, and it is always shown.
   */
  hint?: string;
  /**
   * The dropzone at its own full height, rather than at the height of its own
   * label.
   *
   * A dropzone is the one control in the flow that is genuinely better large,
   * and this used to say so by taking whatever the Section had left over. That
   * made its size a fact about the *screen* — Health's zone was 140px taller
   * than Who you are's for no reason a student could see, and when the screen
   * had nothing to spare the slack turned into white inside the sheet. 9rem is
   * the intrinsic height: enough to read as somewhere you can throw a file,
   * borrowed from nothing.
   */
  tall?: boolean;
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
    <div className="flex flex-col gap-1.5">
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
          /* The dropzone is a dashed Well: the only thing recessed here, and
             an invitation rather than a record (PayPal). The uploaded file
             leaves it and becomes a row in the sibling Well below, so the Well
             never accumulates state.

             It is a *row* rather than a 9rem box this round. A dropzone is an
             invitation, and an invitation does not need a sixth of a 1366×768
             viewport to be understood — that height is what was pushing the
             last field of three Steps below the fold. */
          "rounded-[var(--radius-field)] border border-dashed transition-colors",
          tall
            ? "flex h-[9rem] flex-col items-center justify-center gap-2 p-4 text-center"
            : "flex items-center gap-2.5 px-2.5 py-2",
          dragging ? "border-violet-500 bg-violet-50/60" : "border-ink-200 bg-transparent",
        )}
      >
        <IconTile size={tall ? "lg" : "sm"}>
          <FileArrowUpIcon weight="duotone" aria-hidden className={tall ? "size-6" : "size-4"} />
        </IconTile>
        <div className={cn("min-w-0", tall ? "" : "flex-1")}>
          <p className={cn("text-small font-strong text-ink-900", !tall && "truncate")}>{label}</p>
          <p className={cn("text-micro text-ink-500", !tall && "truncate")}>
            {hint ? `${hint} ` : null}PDF, JPEG or PNG · up to 8 files, 30 MB
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
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
        <ul className="space-y-1 rounded-[var(--radius-field)] bg-well p-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-[var(--radius-field)] border border-ink-100 bg-panel px-2 py-1.5"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-ink-50 text-ink-500">
                {file.name.toLowerCase().endsWith(".pdf") ? (
                  <FilePdfIcon weight="duotone" aria-hidden className="size-3.5" />
                ) : (
                  <ImageIcon weight="duotone" aria-hidden className="size-3.5" />
                )}
              </span>
              <span className="flex min-w-0 flex-1 items-baseline gap-2">
                <span className="truncate text-small text-ink-800">{file.name}</span>
                <span className="shrink-0 text-micro text-ink-400 numeric">
                  {formatSize(file.size)}
                </span>
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
