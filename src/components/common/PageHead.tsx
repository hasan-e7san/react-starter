import { Helmet } from 'react-helmet-async';

export type PageHeadProps = {
  title?: string;
};

export const PageHead = ({ title = 'Kutubi' }: PageHeadProps) => {
  return (
    <Helmet>
      <title> {title} </title>
    </Helmet>
  );
};
