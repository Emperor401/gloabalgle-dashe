// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useLoader } from '../composables/useLoader.js'

import DashboardView      from '../views/DashboardView.vue'
import CustomersView      from '../views/CustomersView.vue'
import TransactionsView   from '../views/TransactionsView.vue'
import AnalyticsView      from '../views/AnalyticsView.vue'
import SettingsView       from '../views/SettingsView.vue'
import HelpView           from '../views/HelpView.vue'
import ComplaintView      from '../views/ComplaintView.vue'
import BrandedEmailsView  from '../views/BrandedEmailsView.vue'
import BrandedBillsView   from '../views/BrandedBillsView.vue'
import EmailComposerView  from '../views/EmailComposerView.vue'
import ToolsView               from '../views/ToolsView.vue'
import CurrencyConverterView   from '../views/CurrencyConverterView.vue'
import WalletFundingView       from '../views/WalletFundingView.vue'
import SmsSenderView           from '../views/SmsSenderView.vue'
import SpoofCallingView        from '../views/SpoofCallingView.vue'
import WalletView              from '../views/WalletView.vue'
import BillingView             from '../views/BillingView.vue'
import TutorialsView           from '../views/TutorialsView.vue'

const routes = [
  { path: '/',                            name: 'Dashboard',      component: DashboardView     },
  { path: '/customers',                   name: 'Customers',      component: CustomersView     },
  { path: '/email-services/branded-emails', name: 'BrandedEmails',  component: BrandedEmailsView },
  { path: '/email-services/branded-bills',  name: 'BrandedBills',   component: BrandedBillsView  },
  { path: '/email-services/composer',       name: 'EmailComposer',  component: EmailComposerView },
  { path: '/transactions',  name: 'Transactions', component: TransactionsView },
  { path: '/analytics',     name: 'Analytics',    component: AnalyticsView    },
  { path: '/settings',      name: 'Settings',     component: SettingsView     },
  { path: '/help',          name: 'Help',         component: HelpView         },
  { path: '/tools',              name: 'Tools',             component: ToolsView             },
  { path: '/tools/currency',       name: 'CurrencyConverter', component: CurrencyConverterView },
  { path: '/tools/wallet-funding', name: 'WalletFunding',    component: WalletFundingView  },
  { path: '/tools/sms-sender',    name: 'SmsSender',     component: SmsSenderView    },
  { path: '/tools/spoof-calling', name: 'SpoofCalling',  component: SpoofCallingView },
  { path: '/wallet',        name: 'Wallet',       component: WalletView       },
  { path: '/billing',       name: 'Billing',      component: BillingView      },
  { path: '/tutorials',     name: 'Tutorials',    component: TutorialsView    },
  { path: '/complaint',     name: 'Complaint',    component: ComplaintView    },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const { loading } = useLoader()

router.beforeEach(() => { loading.value = true  })
router.afterEach(()  => { loading.value = false })

export default router