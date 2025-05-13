import Account from './pages/Account';
import Users from './pages/Users';
import PatientDetails from './pages/PatientDetails';
import PatientList from './pages/PatientList';
import PresentPregnancy from './pages/PresentPregnancy';
import PatientRegistration from './pages/PatientRegistration';
import ConfirmPregnancy from './pages/ConfirmPregnancy';
import PhysicalExam from './pages/PhysicalExam';
import AntenatalProfile from './pages/AntenatalProfile';
import MOH100 from './pages/MOH100';
import CommunityReferrals from './pages/CommunityReferrals';
import Observations from './pages/Observations';
import ViewMOH100 from './pages/ViewMOH100';
import Treatment from './pages/Treatment';
import Reports from './pages/MOH405';
import BirthPlan from './pages/BirthPlan';
import PreviousPregnancy from './pages/PreviousPregnancy';
import TetanusDiptheria from './pages/TetanusDiptheria';
import IFAS from './pages/IFAS';
import MalariaProphylaxis from './pages/MalariaProphylaxis';
import MaternalSerology from './pages/MaternalSerology';
import Deworming from './pages/Deworming';
import Counselling from './pages/Counselling';
import PMTCTInterventions from './pages/PMTCTInterventions';
import MedicalAndSurgicalHistory from './pages/MedicalAndSurgicalHistory';
import Facilites from './pages/Facilities';
import MOH711 from './pages/MOH711';
import Index from './pages/Index';
import NurseDashboard from './pages/NurseDashboard';
import CancerScreening from './pages/cancerScreening';
import FamilyPlanning from './pages/FamilyPlanning';
import DevelopmentalMilestones from './pages/DevelopmentalMilestones';
import DiphtheriaVaccination from './pages/Diphtheria';
import OtherProblems from './pages/OtherProblems';
import BroadClinicalReview from  './pages/BroadClinicalReview';
import MotherPostnatalCare from './pages/motherPostNatalCare';
import RecordOfBabyTeethDevelopment from './pages/BabyTeethDevelopment';
import AEFI from './pages/AEFI';
import FeedingInfo from './pages/FeedingInformation';
import BabyPostNatalCare from './pages/BabyPostNatalCare';
import SpecialCare from './pages/SpecialCare';
import RotaVirusVaccineForm from './pages/RotaVirusVaccine';
import ChildCivilRegistration from './pages/ChildCivilRegistration';
import MicronutrientPowders from './pages/MicronutrientPowders';
import PolioVaccination from './pages/PolioVaccine';
import PneumococalConjugateVaccination from './pages/PneumococalConjugateVaccine';

const appRoutes = [
  {
    path: '/',
    element: Index ,
  },
  {
    path: '/users',
    element: Users ,
  },
  {
    path: '/patients',
    element: PatientList ,
  },
  {
    path: '/patients/:id',
    element: PatientDetails ,
  },
  {
    path: '/settings',
    element: PatientDetails ,
  },
  {
    path: '/present-pregnancy',
    element: PresentPregnancy ,
  },
  {
    path: '/physical-examination',
    element: PhysicalExam ,
  },
  {
    path: '/patient-registration',
    element: PatientRegistration ,
  },
  {
    path: '/antenatal-profile',
    element: AntenatalProfile ,
  },
  {
    path: '/confirm-pregnancy',
    element: ConfirmPregnancy ,
  },
  {
    path: '/community-referrals',
    element: CommunityReferrals ,
  },
  {
    path: '/counselling-treatment',
    element: Treatment ,
  },
  {
    path: '/moh-100',
    element: MOH100 ,
  },
  {
    path: '/moh-711',
    element: MOH711 ,
  },
  {
    path: '/birth-plan',
    element: BirthPlan ,
  },
  {
    path: '/moh-reports',
    element: Reports ,
  },
  {
    path: '/observations',
    element: Observations ,
  },
  {
    path: '/referral/:id',
    element: ViewMOH100 ,
  },
  {
    path: '/tetanus-diptheria',
    element: TetanusDiptheria ,
  },
  {
    path: '/ifas',
    element: IFAS ,
  },
  {
    path: '/malaria-prophylaxis',
    element: MalariaProphylaxis ,
  },
  {
    path: '/maternal-serology',
    element: MaternalSerology ,
  },
  {
    path: '/deworming',
    element: Deworming ,
  },
  {
    path: '/counselling',
    element: Counselling ,
  },
  {
    path: '/pmtct-interventions',
    element: PMTCTInterventions ,
  },
  {
    path: '/medical-surgical-history',
    element: MedicalAndSurgicalHistory ,
  },
  {
    path: '/facilities',
    element: Facilites ,
  },
  {
    path: '/previous-pregnancy',
    element: PreviousPregnancy ,
  },
  {
    path: '/account',
    element: Account ,
  },
  {
    path: '/nurse-dashboard',
    element: NurseDashboard,
  },
  {
    path: '/reproductive-organs-cancer-screening',
    element: CancerScreening,
  },
  {
    path: '/family-planning',
    element: FamilyPlanning,
  },
  {
    path: "/developmental-milestones",
    element: DevelopmentalMilestones,
  },
  {
    path: "/diptheria-vaccine",
    element: DiphtheriaVaccination,
  },
  {
    path: "/other-baby-problems",
    element: OtherProblems,
  },  
  {
    path: "/broad-clinical-review",
    element: BroadClinicalReview,
  },
  {
    path: '/mother-postnatal-care',
    element: MotherPostnatalCare,
  },

  {
    path: '/baby-teeth-development',
    element: RecordOfBabyTeethDevelopment,
  },
  {
    path: '/feeding-information',
    element: FeedingInfo,
  },
  {
    path: '/any-adverse-event',
    element: AEFI
  },
  {
    path: '/baby-postnatal-care',
    element: BabyPostNatalCare,
  }, 
  {
    path: '/reason-for-special-care',
    element: SpecialCare ,
  },
  {
    path: '/rota-virus-vaccine',
    element: RotaVirusVaccineForm,
  },
  {
    path: '/child-civil-registration',
    element: ChildCivilRegistration,
  },
  {
    path: '/micronutrient-powders',
    element: MicronutrientPowders,
  },
  {
    path: "/polio-vaccine",
    element: PolioVaccination
  },
  {
    path: "/pneumococcal-conjugate-vaccine",
    element: PneumococalConjugateVaccination,
  }
  
];

export default appRoutes;