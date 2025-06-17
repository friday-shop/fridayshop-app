import StoreCard from '../components/StoreCard';
import unknownImage from '../assets/images/unknown.png';

function Store() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      {[...Array(10)].map((_, i) => (
        <StoreCard
          key={i}
          title="yoobee"
          description="พร้อมใช้งาน"
          imageUrl={unknownImage}
          status={true}
          id={i.toString()}
        />
      ))}
    </div>
  );
}

export default Store;
