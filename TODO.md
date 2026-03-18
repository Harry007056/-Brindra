# Brindra Enterprise Custom Members & Dynamic Pricing Implementation

Status: ✅ **Plan Approved** | 🔄 In Progress | ⏳ Pending | ✅ Completed

## Breakdown of Steps (Logical Order)

### Phase 1: Frontend UI Enhancements
- ✅ **1.1 Update Pricing.jsx(.new)**: Added input/slider, preview (~₹13/extra), passes `members` param.
- ✅ **1.2 Update Payment.jsx(.new)**: Prefills from URL, ready for backend call.
- ✅ **1.3** plans.js already consistent (has baseTotalPrice/baseMembers).

### Phase 2: Backend Model & API Updates
- ✅ **2.1 Plans.js**: Added fields.
- ✅ **2.2 User.js**: Added customPlanMembers.
- ✅ **2.3 UserService.js**: createCustomEnterprisePlan + assign update.
- ✅ **2.4 UsersController & routes**: POST /:id/enterprise-plan.
- [ ] **2.5 Enforce limits**.
- [ ] **2.3 UserService.js & UsersController.js**: New method `createAndAssignCustomPlan(userId, {members, price})` → create Plan doc → assignPlan.
- [ ] **2.4 usersRoutes.js**: POST `/api/users/:id/enterprise-plan` (auth: team_leader/manager).
- [ ] **2.5 Enforce limits**: In collab/users GET, check `currentMembers >= plan.maxMembers || customMembers` → return warning.

### Phase 3: Integration & Polish
- [ ] **3.1 Frontend Payment**: Replace toast with API call to new endpoint → handle success/redirect.
- [ ] **3.2 TeamMembers.jsx**: Show current members count vs plan limit (fetch from auth/user).
- [ ] **3.3 Settings.jsx**: Display `Members: ${customMembers} / Limit` for enterprise.
- [ ] **3.4 Test**: Pricing input → Payment prefill → backend save → enforcement.
- [ ] **3.5 Seed**: Add enterprise base plan if needed via seedBrindra.js.

### Phase 4: Completion
- [ ] **4.1 Full e2e test**: Auth as team_leader → Pricing → set 100 members → calc price → Payment → confirm → check DB/user.plan.
- [ ] **attempt_completion**

**Current Progress:** ✅ Phase 1 | ✅ 2.1-2.2 Models | 🔄 Phase 2.3 API

**Notes:** 
- Pricing calc: ₹1000 base (76 members) → ~₹13/extra member. Linear scale.
- No Stripe yet → mock API success.
- Use existing Tailwind + React state/useSearchParams.

