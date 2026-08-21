import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Adres e-mail jest wymagany")
    .email("Wprowadź poprawny adres e-mail"),
  consent: z
    .boolean()
    .refine((val) => val === true, "Wymagana jest zgoda na przetwarzanie danych"),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  email: z.string().email("Wprowadź poprawny adres e-mail"),
  message: z.string().min(5, "Wiadomość musi mieć co najmniej 5 znaków"),
});

export type ContactMessageData = z.infer<typeof contactMessageSchema>;
