import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      question: "How does the book exchange work?",
      answer:
        "Our platform connects book owners with book seekers in your local area. Owners list books they're willing to share, and seekers can browse and contact owners to arrange exchanges or borrowing.",
    },
    {
      question: "Is it free to use?",
      answer:
        "Yes! Our basic service is completely free. We believe in promoting reading and building community through book sharing.",
    },
    {
      question: "How do I list a book?",
      answer:
        "Register as a Book Owner, then navigate to your dashboard where you can add books with details like title, author, genre, and your location.",
    },
    {
      question: "How do I contact a book owner?",
      answer:
        "When browsing books, you'll see contact information for each owner. You can reach out via email to arrange the exchange details.",
    },
    {
      question: "What if someone doesn't return my book?",
      answer:
        "While we encourage trust in our community, we recommend setting clear terms when lending books. You can also mark books as unavailable if you prefer to only exchange in person.",
    },
    {
      question: "Can I both lend and borrow books?",
      answer:
        "You can register as both an owner and a seeker, allowing you to share your collection and find new books to read.",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
            Find answers to common questions about our book exchange platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="font-sans"
              >
                <AccordionTrigger className="text-left font-serif">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-sans">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
