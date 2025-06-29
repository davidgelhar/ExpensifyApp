import type {OnboardingCompanySize} from '@libs/actions/Welcome/OnboardingFlow';
import type {OnboardingAccounting} from '@src/CONST';
import type {OnboardingPurpose} from '@src/types/onyx';

type CompleteGuidedSetupParams = {
    firstName: string;
    lastName: string;
    actorAccountID: number;
    guidedSetupData: string;
    engagementChoice: OnboardingPurpose;
    paymentSelected?: string;
    companySize?: OnboardingCompanySize;
    userReportedIntegration?: OnboardingAccounting;
    policyID?: string;
    selfDMReportID?: string;
    selfDMCreatedReportActionID?: string;
};

export default CompleteGuidedSetupParams;
