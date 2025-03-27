
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSectionEditor } from "@/hooks/useSectionEditor";

interface TestimonialsEditorProps {
  contentData: Record<string, any>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  role?: string;
  company?: string;
}

const TestimonialsEditor: React.FC<TestimonialsEditorProps> = ({ contentData, handleInputChange }) => {
  const { setContentData, setIsDirty } = useSectionEditor();
  
  const testimonials: Testimonial[] = contentData.testimonials || [];
  
  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Math.random().toString(36).substring(2, 9),
      name: "Customer Name",
      text: "Sample testimonial text. This customer was very satisfied with our service.",
      role: "Customer",
      company: "Company Name"
    };
    
    const updatedTestimonials = [...testimonials, newTestimonial];
    
    setContentData({
      ...contentData,
      testimonials: updatedTestimonials
    });
    setIsDirty(true);
  };
  
  const removeTestimonial = (id: string) => {
    const updatedTestimonials = testimonials.filter(t => t.id !== id);
    
    setContentData({
      ...contentData,
      testimonials: updatedTestimonials
    });
    setIsDirty(true);
  };
  
  const updateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
    const updatedTestimonials = testimonials.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    );
    
    setContentData({
      ...contentData,
      testimonials: updatedTestimonials
    });
    setIsDirty(true);
  };
  
  return (
    <Tabs defaultValue="content">
      <TabsList className="mb-4">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              name="title"
              value={contentData.title || "What Our Customers Say"}
              onChange={handleInputChange}
              placeholder="Section Title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Section Description</Label>
            <Textarea
              id="description"
              name="description"
              value={contentData.description || "Here's what our satisfied customers have to say about our services"}
              onChange={handleInputChange}
              placeholder="Section Description"
              rows={3}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="testimonials">
        <div className="space-y-4">
          <Button onClick={addTestimonial} className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
          
          {testimonials.length === 0 ? (
            <div className="text-center p-6 border rounded-lg">
              <p className="text-muted-foreground mb-2">No testimonials added yet.</p>
              <p className="text-muted-foreground text-sm">Click "Add Testimonial" to add your first customer review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor={`name-${testimonial.id}`}>Customer Name</Label>
                      <Input
                        id={`name-${testimonial.id}`}
                        value={testimonial.name}
                        onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                        placeholder="Customer Name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`role-${testimonial.id}`}>Customer Role/Title</Label>
                      <Input
                        id={`role-${testimonial.id}`}
                        value={testimonial.role || ""}
                        onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                        placeholder="Customer Role (optional)"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`company-${testimonial.id}`}>Company</Label>
                      <Input
                        id={`company-${testimonial.id}`}
                        value={testimonial.company || ""}
                        onChange={(e) => updateTestimonial(testimonial.id, 'company', e.target.value)}
                        placeholder="Company Name (optional)"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`text-${testimonial.id}`}>Testimonial Text</Label>
                      <Textarea
                        id={`text-${testimonial.id}`}
                        value={testimonial.text}
                        onChange={(e) => updateTestimonial(testimonial.id, 'text', e.target.value)}
                        placeholder="Testimonial content"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removeTestimonial(testimonial.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="appearance">
        <div className="space-y-4">
          <div>
            <Label htmlFor="displayStyle">Display Style</Label>
            <select
              id="displayStyle"
              name="displayStyle"
              className="w-full p-2 border rounded mt-1"
              value={contentData.displayStyle || "cards"}
              onChange={(e) => {
                const syntheticEvent = {
                  target: {
                    name: "displayStyle",
                    value: e.target.value
                  }
                } as React.ChangeEvent<HTMLInputElement>;
                handleInputChange(syntheticEvent);
              }}
            >
              <option value="cards">Cards</option>
              <option value="carousel">Carousel</option>
              <option value="simple">Simple List</option>
            </select>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TestimonialsEditor;
