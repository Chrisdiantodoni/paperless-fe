import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "./form-context"
import {
  TextField,
  NumberField,
  CheckboxField,
  SelectField,
  DatePickerField,
  FileUploadField,
  CheckboxGroupField,
  TextareaField,
  RichTextEditorField,
} from "../fields"
import { SubmitButton } from "./submit-button"

// =====================================================================
// This is the reusability + extensibility layer: any component can call
// `useAppForm(...)` and get a `form` with `<form.AppField>` / `<form.AppForm>`
// that already knows about every registered control below — fully typed,
// no wrapper boilerplate per form.
//
// Not limited to this list: to add a brand-new control (a color picker, a
// signature pad, a combobox, whatever your product needs), do exactly two
// things:
//   1. Build it in `fields/your-field.tsx` using `useFieldContext<T>()`.
//   2. Register it below. It's then available everywhere as `field.YourField`.
//
//
// ---------------------------------------------------------------------
// HOW TO USE A FIELD THAT IS REGISTERED HERE
// ---------------------------------------------------------------------
// Use `form.AppField`, then call it as `field.<Name>` — no import needed
// beyond `useAppForm` itself:
//
//   const form = useAppForm({
//     defaultValues: { email: '' },
//     onSubmit: async ({ value }) => { ... },
//   })
//
//   <form.AppField
//     name="email"
//     validators={{
//       onChange: ({ value }) => (!value ? 'Email is required' : undefined),
//     }}
//   >
//     {(field) => <field.TextField label="Email" type="email" />}
//   </form.AppField>
//
//   <form.AppForm>
//     <form.SubmitButton label="Save" />
//   </form.AppForm>
//
// You get this for every entry in `fieldComponents` below: field.TextField,
// field.NumberField, field.SelectField, field.CheckboxGroupField, etc.
// Same applies to `formComponents` (currently just SubmitButton), used
// inside `<form.AppForm>` as `<form.SubmitButton />`.
//
//
// ---------------------------------------------------------------------
// HOW TO USE A FIELD THAT IS *NOT* REGISTERED HERE
// ---------------------------------------------------------------------
// You are never required to register anything. Use the core `form.Field`
// API instead — it works with ANY component, no setup, no import from this
// file. You get the `field` object as a render-prop argument and wire it
// into your component's own props manually:
//
//   <form.Field
//     name="riskScore"
//     validators={{
//       onChange: ({ value }) => (value < 0 ? 'Cannot be negative' : undefined),
//     }}
//   >
//     {(field) => (
//       <RiskGauge
//         value={field.state.value}
//         onChange={field.handleChange}
//         onBlur={field.handleBlur}
//         error={field.state.meta.errors[0]}
//       />
//     )}
//   </form.Field>
//
// Use this path for:
//   - a one-off component you're only using in a single form
//   - a component you don't own (a design-system import, a third-party
//     widget) that you don't want to couple to this form module
//   - something you're still iterating on and don't want to commit to
//     the shared registry yet
//   - a component whose value can't bind to a single fixed field path
//     (e.g. `Repeater` in fields/repeater.tsx takes `form` directly instead,
//     because it needs to generate one path per array item)
//
// `form.Field` and `form.AppField` freely mix in the same form — registering
// a handful of common controls here doesn't stop you from reaching for
// `form.Field` anywhere else.
//
//
// ---------------------------------------------------------------------
// HOW TO REGISTER A NEW FIELD (turn "not registered" into "registered")
// ---------------------------------------------------------------------
// 1. Build the component in `fields/your-field.tsx` using useFieldContext
//    instead of receiving `field` as a prop:
//
//      import { useFieldContext } from '../form-context'
//
//      export function ColorPickerField({ label }: { label: string }) {
//        const field = useFieldContext<string>()
//        return (
//          <input
//            type="color"
//            value={field.state.value}
//            onChange={(e) => field.handleChange(e.target.value)}
//            onBlur={field.handleBlur}
//          />
//        )
//      }
//
// 2. Export it from `fields/index.ts`, import it above, and add it to
//    `fieldComponents` below. It then becomes `field.ColorPickerField`
//    everywhere `useAppForm` is used — no changes needed in any existing
//    form.
//
//
// ---------------------------------------------------------------------
// TEMPORARILY DISABLING A REGISTERED FIELD (see RichTextField below)
// ---------------------------------------------------------------------
// Comment out both the import and its entry in `fieldComponents` together,
// as done with `RichTextField` below. Any form still calling
// `field.RichTextField` will fail to type-check until it's uncommented
// again — that's the safety net, not a bug.
// =====================================================================
export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
    CheckboxField,
    SelectField,
    DatePickerField,
    FileUploadField,
    CheckboxGroupField,
    TextareaField,
    RichTextEditorField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
