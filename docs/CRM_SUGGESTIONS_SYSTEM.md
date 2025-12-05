# 🎯 CircuitRack CRM & Suggestions System - Complete Documentation

## 📋 Project Overview

This is a comprehensive Customer Relationship Management (CRM) and Suggestions/Issues tracking system built for CircuitRack marketplace platform.

---

## 🏗️ System Architecture

### Core Components:
1. **Suggestions System** - Track user feedback, complaints, and bug reports
2. **CRM System** - Manage leads and customer relationships
3. **Notification System** - Automated email notifications
4. **Admin Dashboard** - Manage tickets and leads
5. **User Portal** - View and manage own tickets

---

## 📊 Database Schema

### Tables Created:
- `suggestions` - Main tickets table
- `suggestion_replies` - Replies to tickets
- `crm_leads` - Customer leads database
- `crm_activity` - Activity tracking log
- `notifications` - Email notification queue

**Schema File:** `supabase/migrations/001_crm_suggestions_schema.sql`

---

## 🎫 Suggestion Categories

### Visitor:
- `visitor_suggestion` - General suggestion
- `visitor_complaint` - General complaint

### Buyer:
- `buyer_purchase_issue` - Purchase problems
- `buyer_pricing_issue` - Pricing concerns
- `buyer_payment_issue` - Payment/wallet issues
- `buyer_vendor_issue` - Problems with vendor
- `buyer_technical_issue` - Technical difficulties

### Vendor:
- `vendor_product_listing_issue` - Product listing problems
- `vendor_pricing_issue` - Pricing setup issues
- `vendor_earnings_issue` - Earnings/withdrawal problems
- `vendor_auction_issue` - Auction-related issues
- `vendor_dashboard_suggestion` - Dashboard improvements

### System:
- `bug_report` - Software bugs
- `new_product_suggestion` - Suggest new product
- `new_category_suggestion` - Suggest new category
- `frontend_issue` - UI/UX issues
- `backend_api_issue` - API problems
- `design_suggestion` - Design improvements
- `ux_improvement_suggestion` - UX enhancements

---

## 🔄 Workflow

### 1. User Submits Suggestion:
```
User fills form → POST /api/suggestions → Save to DB → Create/Update Lead → Send notifications
```

### 2. Admin Reviews:
```
Admin dashboard → View tickets → Assign → Update status → Reply → Close
```

### 3. Lead Scoring:
```
Activity tracked → Auto-calculate score → Update lead status → Trigger automation
```

---

## 📁 File Structure

```
app/
├── [lang]/
│   ├── suggestions/
│   │   ├── new/page.tsx          # Submit new suggestion
│   │   └── my-tickets/page.tsx   # User's tickets
│   └── admin/
│       ├── suggestions/page.tsx   # Admin dashboard
│       └── crm/
│           ├── leads/page.tsx     # CRM leads
│           └── analytics/page.tsx # CRM analytics
├── api/
│   ├── suggestions/
│   │   ├── route.ts              # GET, POST suggestions
│   │   ├── [id]/route.ts         # GET, PATCH specific ticket
│   │   └── [id]/reply/route.ts   # POST reply
│   ├── crm/
│   │   ├── create-lead/route.ts
│   │   ├── update-lead/route.ts
│   │   └── calculate-score/route.ts
│   └── notifications/
│       └── send/route.ts
lib/
├── crm/
│   ├── leadScoring.ts            # Lead scoring logic
│   └── emailTemplates.ts         # Email templates
└── supabase/
    └── migrations/
        └── 001_crm_suggestions_schema.sql
messages/
├── ar/
│   └── suggestions.json
├── en/
│   └── suggestions.json
└── zh/
    └── suggestions.json
```

---

## 🎨 UI Components Needed

### Forms:
- `SuggestionForm` - Multi-step suggestion submission
- `ReplyForm` - Admin reply form
- `LeadForm` - Create/edit lead

### Tables:
- `SuggestionsTable` - Filterable tickets table
- `LeadsTable` - CRM leads table
- `ActivityTimeline` - Activity log display

### Cards:
- `TicketCard` - Ticket summary card
- `LeadCard` - Lead summary card
- `StatsCard` - Dashboard statistics

### Modals:
- `TicketDetailsModal` - Full ticket view
- `AssignModal` - Assign ticket to admin
- `StatusUpdateModal` - Update ticket status

---

## 🔐 API Endpoints

### Suggestions:
```typescript
POST   /api/suggestions              // Create new suggestion
GET    /api/suggestions              // List all (with filters)
GET    /api/suggestions/[id]         // Get specific ticket
PATCH  /api/suggestions/[id]         // Update ticket
POST   /api/suggestions/[id]/reply   // Add reply
```

### CRM:
```typescript
POST   /api/crm/create-lead          // Create lead
PATCH  /api/crm/update-lead          // Update lead
GET    /api/crm/leads                // List leads
POST   /api/crm/calculate-score      // Recalculate lead score
```

### Notifications:
```typescript
POST   /api/notifications/send       // Send email notification
```

---

## 📧 Email Templates

### Languages Supported: ar, en, zh

### Templates:
1. **Suggestion Received** - Confirmation to user
2. **Admin Alert** - New ticket notification
3. **Status Updated** - Ticket status change
4. **Reply Received** - New reply notification
5. **Ticket Resolved** - Resolution notification
6. **Lead Welcome** - New lead welcome email

---

## 🎯 Lead Scoring Algorithm

```typescript
Base Score Calculation:
- Visits: 2 points per visit (max 20)
- Pages viewed: 1 point each (max 15)
- Products viewed: 5 points each (max 20)
- Time on site: 1 point per minute (max 15)
- Suggestions submitted: 5 points each (max 15)
- Role bonus: Vendor +15, Buyer +10

Total: 0-100 points
```

### Score Ranges:
- 0-25: Cold lead
- 26-50: Warm lead
- 51-75: Hot lead
- 76-100: Very hot lead

---

## 🔔 Notification Triggers

### Auto-send emails when:
- ✅ New suggestion submitted
- ✅ Ticket status changed
- ✅ Reply added
- ✅ Ticket assigned
- ✅ Ticket resolved
- ✅ New lead created
- ✅ Lead score threshold reached

---

## 🌍 Internationalization

### Translation Keys Structure:
```json
{
  "suggestions": {
    "title": "...",
    "categories": {
      "visitor_suggestion": "...",
      "buyer_purchase_issue": "..."
    },
    "priorities": {
      "low": "...",
      "high": "..."
    },
    "statuses": {
      "open": "...",
      "resolved": "..."
    }
  }
}
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation ✅
- [x] Database schema
- [x] Basic API routes
- [x] Translation files

### Phase 2: Core Features (Next)
- [ ] Suggestion submission form
- [ ] Admin dashboard
- [ ] Email notifications

### Phase 3: CRM Features
- [ ] Lead management
- [ ] Auto lead scoring
- [ ] Activity tracking

### Phase 4: Advanced Features
- [ ] Analytics dashboard
- [ ] Automated workflows
- [ ] Advanced filtering

---

## 📝 Usage Examples

### Submit a Suggestion:
```typescript
const response = await fetch('/api/suggestions', {
  method: 'POST',
  body: JSON.stringify({
    title: "Pricing issue",
    description: "...",
    category: "buyer_pricing_issue",
    reporter_type: "buyer",
    priority: "high",
    email: "user@example.com"
  })
});
```

### Update Lead Score:
```typescript
await fetch('/api/crm/calculate-score', {
  method: 'POST',
  body: JSON.stringify({ leadId: "..." })
});
```

---

## 🎓 Best Practices

1. **Always validate input** on both client and server
2. **Sanitize user content** before displaying
3. **Rate limit** API endpoints
4. **Log all admin actions** for audit trail
5. **Use transactions** for multi-table operations
6. **Cache frequently accessed data**
7. **Implement proper error handling**
8. **Test email templates** in all languages

---

## 🔧 Configuration

### Environment Variables Needed:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
ADMIN_EMAIL=
```

---

## 📊 Metrics to Track

### Suggestions:
- Total tickets
- Open vs closed
- Average resolution time
- Tickets by category
- Tickets by priority

### CRM:
- Total leads
- Conversion rate
- Average lead score
- Leads by source
- Leads by status

---

## 🎯 Success Criteria

✅ Users can submit suggestions in 3 languages
✅ Admins can manage tickets efficiently
✅ Automated email notifications work
✅ Lead scoring updates automatically
✅ System tracks all activity
✅ Dashboard shows real-time metrics
✅ Mobile-responsive design
✅ Fast page load times (<2s)

---

**Status:** Foundation Complete ✅
**Next Steps:** Build suggestion form and admin dashboard
**Estimated Completion:** Phase 2-4 implementation needed

---

*Documentation last updated: 2025-12-06*
