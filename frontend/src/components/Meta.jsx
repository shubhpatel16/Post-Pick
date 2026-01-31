import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Post&Pick',
  description: 'Trendy fashion & clothing for everyone',
  keywords: 'fashion, clothing, online store, post and pick',
};

export default Meta;
