
import React, { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { helpFaqsData } from "./helpData";

interface HelpFAQsProps {
  searchQuery: string;
  accountType: string;
}

export const HelpFAQs = ({ searchQuery, accountType }: HelpFAQsProps) => {
  const filteredFaqs = useMemo(() => {
    return helpFaqsData.filter((faq) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
        );
      }
      
      // Filter by account type (show all general questions plus account-specific ones)
      return faq.forAccountTypes.includes('all') || faq.forAccountTypes.includes(accountType);
    });
  }, [searchQuery, accountType]);

  if (filteredFaqs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No FAQs match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
      
      <Accordion type="single" collapsible className="w-full">
        {filteredFaqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span>{faq.question}</span>
                {faq.forAccountTypes.includes(accountType) && faq.forAccountTypes[0] !== 'all' && (
                  <Badge variant="outline" className="capitalize">{accountType}</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm max-w-none">
                <p>{faq.answer}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
