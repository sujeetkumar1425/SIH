// Assume Calendar and the utility functions are defined in the files mentioned in your original import statements
// import { Calendar } from "./Calendar"; 
// import { cn } from "./utils"; // You still need your utility functions for the first code block to work

import * as React from "react";
import { useState } from "react";
import { Calendar } from "./Calendar"; // Import the component you defined
import { buttonVariants } from "./button"; // Assuming this is also defined

// A parent component where both are used
function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Note: The `className` and `buttonVariants` imports are needed for the original Calendar component code to compile correctly.

  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Section 1: Your custom React Date Picker UI component */}
      <section>
        <h1 className="text-xl font-semibold mb-4">Select a Date Locally</h1>
        <div className="flex justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow"
            />
        </div>
        <p className="mt-4 text-center">
            Selected date: {date ? date.toDateString() : "None selected"}
        </p>
      </section>

      {/* Section 2: The Google Calendar Iframe Embed */}
      <section>
        <h1 className="text-xl font-semibold mb-4">Embedded Google Calendar</h1>
        {/* You should wrap this raw HTML in a JSX fragment or div */}
        <div className="w-full flex justify-center">
            <iframe 
                src="https://calendar.google.com/calendar/embed?src=sujeetku2507%40gmail.com&ctz=UTC" 
                style={{ border: 0 }} // Use JSX style object for inline styles
                width="800" 
                height="600" 
                frameBorder="0" 
                scrolling="no"
                title="Google Calendar Embed" // Always add a title for accessibility
            ></iframe>
        </div>
      </section>
    </div>
  );
}

// Export the page component for use in your application's routing
// export default CalendarPage;
