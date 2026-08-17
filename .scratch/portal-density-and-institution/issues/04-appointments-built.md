# 04 — Appointments, built

Status: done

**What to build:** The Area whose absence started this entire body of work. The
client's words, hunting for it in the portal that shipped: *"Cadê a pointment na
side bar? Então quer dizer que eu não posso simplesmente marcar um, sei lá, um
suporte em algum dia específico?"*

It has been in the sidebar since the last cycle. This ticket makes it answer.

**To the depth the demonstration needs and no deeper**: three services — financial
aid, academic advising and student support — a short run of days, slots inside a
day, and one booking at a time. The booking is stored in the portal's own slice
and is visible when the student comes back to the Area.

**No** rescheduling policy, **no** staff profiles, **no** availability rules, **no**
calendar integration. A screen that books a time and shows it back is the whole
claim; anything past that is the next cycle inventing itself.

**Blocked by:** 01 — it inherits the shell's title scale and signature.

**Referências:**
- [Motion](https://mobbin.com/screens/90e54b69-a702-4b76-9e01-2c5730f24b05) — a dense day and slot list where the time is the primary field and everything else is metadata beside it.
- [Superlist](https://mobbin.com/screens/2b0e4165-892c-4bdc-8e80-f6a0bdf57311) — the plain, ungarnished list this screen should look like, rather than a calendar widget nobody asked for.

- [x] Three services, each named as a thing a student would actually book
- [x] Days and slots, from a fixture, with `TODAY` as the clock
- [x] Booking one shows it back on the screen and survives a reload
- [x] The booked time is reachable from the Area without hunting
- [x] Nothing about rescheduling, staff profiles or availability rules
- [x] `pnpm typecheck`, `pnpm test` and `pnpm lint` pass
