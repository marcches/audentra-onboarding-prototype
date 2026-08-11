import { FileArrowUpIcon, FilePdfIcon, ImageIcon, TrashIcon } from "@phosphor-icons/react";
import * as React from "react";

import { Notice } from "@/components/notice";
import { Button } from "@/components/ui/button";
import type { UploadedFile } from "@/lib/store";
import { cn } from "@/lib/utils";

/** The sheet's restrictions, verbatim: "PDF, JPEG, PNG. Up to 8 files, 30 MB total." */
const ACCEPTED = ["application/pdf", "image/jpeg", "image/png"];
const ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png";
const MAX_FILES = 8;
const MAX_TOTAL_BYTES = 30 * 1024 * 1024;

/**
 * Below this, an image is treated as too low-quality to read — the SC-012 case,
 * "uploads a low-quality image". A prototype has no OCR to fail, so the failure
 * needs a trigger a reviewer can actually reach: dropping in a tiny thumbnail
 * produces the unreadable path, and a real photograph or scan produces the
 * success path.
 */
const UNREADABLE_UNDER_BYTES = 20 * 1024;

type UploadError = "type" | "size" | "count" | "unreadable";

/** Every one of these is the sheet's own string (field inventory, line 18). */
const ERRORS: Record<UploadError, string> = {
  unreadable: "We could not read this document. Fill the fields in yourself, or try another file.",
  type: "This file type is not accepted. Use PDF, JPEG or PNG.",
  size: "This file is larger than 30 MB.",
  count: "You can attach up to 8 files.",
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * The identity document upload.
 *
 * This existed as a promise and nothing else: a notice announcing that EDward
 * reads your ID, with no control behind it. Laura went looking for the control
 * on camera — "onde que eu coloco aqui o upload e o national ID? Eu faço o
 * upload onde?" — which is the clearest possible verdict on "keep it as it is".
 *
 * The upload is real. The extraction behind it is simulated, like everything
 * else in this prototype: what was out of scope was OCR, not the existence of
 * somewhere to click.
 */
export function IdUpload({
  files,
  extracted,
  onChange,
  onExtracted,
}: {
  files: UploadedFile[];
  extracted: boolean;
  onChange: (files: UploadedFile[]) => void;
  onExtracted: () => void;
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
    const nextTotal = total + list.reduce((sum, file) => sum + file.size, 0);
    if (nextTotal > MAX_TOTAL_BYTES) return setError("size");

    const added = list.map((file) => ({ name: file.name, size: file.size }));
    onChange([...files, ...added]);

    /* The read either works or it does not, and the student is told which.
       "Nothing was lost" is the point of the failure path: the fields stay
       fillable by hand and the file stays attached. */
    if (added.some((file) => file.size < UNREADABLE_UNDER_BYTES)) {
      setError("unreadable");
      return;
    }
    setError(null);
    onExtracted();
  }

  return (
    <div className="space-y-3">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop is an
          enhancement layered on top of the "Choose files" button inside this
          box, which is the keyboard and screen-reader path and is always
          present. Giving the drop zone a role would announce a control that
          nobody without a pointer can operate. */}
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
          {/* Helper text, the sheet's own. It says what is wanted and why, and
              it does not repeat the label above it. */}
          <p className="text-body font-bold text-ink-900">
            Upload an ID and we will fill in what we can.
          </p>
          <p className="text-small text-ink-500">
            Passport, national ID or driver's licence. PDF, JPEG or PNG, up to 8 files, 30 MB in
            total.
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
          aria-label="Upload an identity document"
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

      {extracted && !error ? (
        <Notice tone="success" title="We read your document">
          We read your document and filled in the fields below. Check them before continuing. We
          keep your original file, and nothing we read counts until a person checks it.
        </Notice>
      ) : null}
    </div>
  );
}
