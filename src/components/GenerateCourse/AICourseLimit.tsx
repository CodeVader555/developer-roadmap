import { useQuery } from '@tanstack/react-query';
import { getAiCourseLimitOptions } from '../../queries/ai-course';
import { queryClient } from '../../stores/query-client';
import { billingDetailsOptions } from '../../queries/billing';
import { getPercentage } from '../../helper/number';
import { Gift, Info } from 'lucide-react';

type AICourseLimitProps = {
  onUpgrade: () => void;
  onShowLimits: () => void;
};

export function AICourseLimit(props: AICourseLimitProps) {
  const { onUpgrade, onShowLimits } = props;

  const { data: limits, isLoading } = useQuery(
    getAiCourseLimitOptions(),
    queryClient,
  );

  const { data: userBillingDetails, isLoading: isBillingDetailsLoading } =
    useQuery(billingDetailsOptions(), queryClient);

  if (isLoading || !limits || isBillingDetailsLoading || !userBillingDetails) {
    return (
      <div className="hidden h-[38px] w-[208.09px] animate-pulse rounded-lg border border-gray-200 bg-gray-200 lg:block"></div>
    );
  }

  const { used, limit } = limits;

  const totalPercentage = getPercentage(used, limit);

  // has consumed 80% of the limit
  const isNearLimit = used >= limit * 0.8;
  const isPaidUser = userBillingDetails.status !== 'none';

  return (
    <>
      <button
        className="mr-1 flex items-center gap-1 text-sm font-medium underline underline-offset-2 lg:hidden"
        onClick={() => onShowLimits()}
      >
        <Info className="size-4" />
        {totalPercentage}% limit used
      </button>

      {(!isPaidUser || isNearLimit) && (
        <button
          onClick={() => {
            onShowLimits();
          }}
          className="relative hidden h-full min-h-[38px] cursor-pointer items-center overflow-hidden rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 lg:flex"
        >
          <span className="relative z-10">
            {totalPercentage}% of the daily limit used
          </span>
          <div
            className="absolute inset-0 h-full bg-gray-200/80"
            style={{
              width: `${totalPercentage}%`,
            }}
          ></div>
        </button>
      )}

      {!isPaidUser && (
        <button
          className="hidden items-center justify-center gap-1 rounded-md bg-yellow-400 px-4 py-1 text-sm font-medium underline-offset-2 hover:bg-yellow-500 lg:flex"
          onClick={() => onUpgrade()}
        >
          <Gift className="size-4" />
          Upgrade
        </button>
      )}
    </>
  );
}
