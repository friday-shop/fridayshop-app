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
      <StoreCard
        title="yoobee"
        description="พร้อมใช้งาน"
        imageUrl={unknownImage}
        status={true}
        id="1"
      />
      <StoreCard
        title="yoobee"
        description="พร้อมใช้งาน"
        imageUrl={unknownImage}
        status={true}
        id="1"
      />
      <StoreCard
        title="yoobee"
        description="พร้อมใช้งาน"
        imageUrl={unknownImage}
        status={true}
        id="1"
      />
      <StoreCard
        title="yoobee"
        description="พร้อมใช้งาน"
        imageUrl={unknownImage}
        status={true}
        id="1"
      />
      <StoreCard
        title="yoobee"
        description="พร้อมใช้งาน"
        imageUrl={unknownImage}
        status={true}
        id="1"
      />
      <StoreCard
        title="yoobee"
        description="พร้อมใช้งาน"
        imageUrl={unknownImage}
        status={true}
        id="1"
      />
      <StoreCard
        title="yoobee"
        description="พร้อมใช้งาน"
        imageUrl={unknownImage}
        status={true}
        id="1"
      />
      <StoreCard
        title="yoobee"
        description="พร้อมใช้งาน"
        imageUrl={unknownImage}
        status={true}
        id="1"
      />
    </div>
  );
}

export default Store;
