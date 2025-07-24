# MindDumper App - Claude Development Notes
## Standard Workflow
1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the [todo.md](http://todo.md/) file with a summary of the changes you made and any other relevant information.

## 🚨 VERPLICHTE WORKFLOW VOOR CODE WIJZIGINGEN

**BELANGRIJK: We testen ALTIJD direct in productie - NOOIT lokaal.**

**ALTIJD DEZE STAPPEN VOLGEN VOOR ELKE WIJZIGING:**

1. **Lokaal builden (alleen voor validatie)**:
   ```bash
   npm run build
   ```
   
2. **Alleen committen als build succesvol is**:
   - Geen TypeScript errors
   - Geen ESLint errors  
   - Geen compilation failures
   
3. **Direct naar productie pushen**:
   ```bash
   git add .
   git commit -m "beschrijving"
   git push
   ```

4. **Testen in productie**:
   - Test nieuwe features op live website
   - Check browser console voor errors
   - Verifieer functionaliteit werkt correct

## Recent Improvements (July 2025)

### Landing Page Optimizations
- **Marketing Copy**: Updated key messaging for better clarity and impact
- **FAQ Expansion**: Grew from 6 to 11 comprehensive FAQ items
- **Problem Scenarios**: Expanded from 6 to 12 relatable mental overwhelm examples  
- **Content Cleanup**: Removed testimonials (no real reviews yet) and solo developer sections
- **UI Consistency**: Fixed "4 steps" title vs 3 actual steps shown
- **Accuracy**: Changed "daily" to "regularly" for realistic usage frequency

### Security Improvements (July 24, 2025)
- **Webhook Security Fix**: Added Row Level Security (RLS) policies to webhook_lock table
- **Supabase Compliance**: Resolved security warning for public table without RLS
- **Minimal Impact**: Database-only change, no application code modifications needed
- **Service Role Access**: Maintained webhook functionality while blocking public access

### Development Notes
- All changes focused on conversion optimization and user clarity
- Maintained semantic HTML structure and accessibility
- Used TodoWrite tool effectively for task management
- Followed build → commit → push workflow successfully
- Landing page size optimized (improved loading performance)

