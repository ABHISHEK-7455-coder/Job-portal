import { createServer } from "miragejs";

export function makeServer() {
    createServer({
        routes() {
            this.namespace = "api";

            this.get("/dashboard", () => {
                return {
                    applications: [
                        { id: 1, status: "sent" },
                        { id: 2, status: "interview" },
                        { id: 3, status: "offer" },
                        { id: 3, status: "offer" },
                        { id: 3, status: "offer" },
                        { id: 4, status: "interview" },
                        { id: 4, status: "interview" },
                        { id: 4, status: "interview" },
                        { id: 1, status: "sent" },
                        { id: 1, status: "sent" },
                        { id: 1, status: "sent" },
                        { id: 1, status: "sent" },
                        { id: 1, status: "sent" },
                    ],
                    savedJobs: [
                        { id: 1, title: "Frontend Developer", company: "Google", location: "Remote" },
                        { id: 2, title: "UI/UX Designer", company: "Netflix", location: "Office" },
                    ],
                    messages: [
                        { id: 1, from: "HR at Meta", text: "Interview scheduled", read: false },
                        { id: 2, from: "System", text: "You saved a new job", read: true },
                    ],
                    interviews: [
            { id: 1, company: 'Google', title: 'Frontend Dev', date: '2025-07-20', time: '10:00 AM' }
          ],
          recentActivity: [
            { id: 1, action: 'Applied to React Developer at Amazon' },
            { id: 2, action: 'Viewed job: UI Designer at Netflix' }
          ]
                };
            });
         this.get('/profile', () => {
        return {
          name: 'Abhishek',
          email: 'abhi@example.com',
          resume: 'Resume uploaded',
          skills: ['React', 'Redux', 'JavaScript']
        };
      });
    }
  });
}
