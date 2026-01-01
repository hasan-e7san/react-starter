import { addDays, subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePickerWithRange } from './DatePickerWithRange';

export type DateRangeFilterProps = {
  className?: string;
  startDateParamName?: string;
  endDateParamName?: string;
};

export const DateRangeFilter = ({
  className,
  startDateParamName = 'filterStartDate',
  endDateParamName = 'filterEndDate'
}: DateRangeFilterProps) => {
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const onFilterChanged = (
    startDateValue: Date | undefined,
    endDateValue: Date | undefined
  ) => {
    if (startDateValue && endDateValue) {
      setStartDate(startDateValue?.toISOString().split('T')[0]);
      setEndDate(endDateValue?.toISOString().split('T')[0]);
      queryParams.set(
        startDateParamName,
        startDateValue.toISOString().split('T')[0]
      );
      queryParams.set(
        endDateParamName,
        endDateValue.toISOString().split('T')[0]
      );
      navigate({ search: queryParams.toString() });
    }
  };

  useEffect(() => {
    const filterStartDate =
      queryParams.get(startDateParamName) ??
      subDays(new Date(), 2).toISOString().split('T')[0];
    const filterEndDate =
      queryParams.get(endDateParamName) ??
      addDays(new Date(), 3).toISOString().split('T')[0];

    setStartDate(filterStartDate);
    setEndDate(filterEndDate);
  }, [location.search]);

  const [startDate, setStartDate] = useState(() => {
    const filterStartDate =
      queryParams.get(startDateParamName) ??
      subDays(new Date(), 2).toISOString().split('T')[0];
    return filterStartDate;
  });

  const [endDate, setEndDate] = useState(() => {
    const filterEndDate =
      queryParams.get(endDateParamName) ??
      addDays(new Date(), 3).toISOString().split('T')[0];
    return filterEndDate;
  });

  return (
    <DatePickerWithRange
      startDate={new Date(startDate + 'T00:00')}
      endDate={new Date(endDate + 'T00:00')}
      onChange={onFilterChanged}
      className={`pt-0 ${className}`}
    />
  );
};
