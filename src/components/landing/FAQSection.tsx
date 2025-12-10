import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is RoomCraft?',
    answer: 'RoomCraft is a web-based 3D room design tool that allows you to create stunning interior designs using drag-and-drop functionality. No prior design experience required.',
  },
  {
    question: 'Can I use RoomCraft for free?',
    answer: 'Yes! Our free plan includes 3 projects, access to 50 models, and basic export options. Perfect for getting started with interior design.',
  },
  {
    question: 'What 3D formats are supported?',
    answer: 'RoomCraft supports GLB and GLTF formats for 3D models. Pro and Enterprise users can upload their own custom models in these formats.',
  },
  {
    question: 'Can I share my designs with others?',
    answer: 'Absolutely! All plans include sharing capabilities. Generate a shareable link and send it to clients, friends, or collaborators.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, all your projects and data are encrypted and stored securely in the cloud. Enterprise plans include additional security features like SSO.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your projects will remain accessible but you\'ll lose access to premium features.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Frequently Asked
            <span className="gradient-text"> Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about RoomCraft
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass rounded-xl px-6 border-border/50"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
