import CategoryCard from '../components/CategoryCard';
import unknownImage from '../assets/images/unknown.png';

function Category() {
  return (
    <div>
      <CategoryCard
        title="ShortMax"
        description="loremloremloremloremloremloremloremloremasdasdsanfkjsdbfhjdbsghjbghjbwefgsdfdsfsdfsdfsdfsdfsdfloremloremloremloremloremloremloremloremasdasdsanfkjsdbfhjdbsghjbghjbwefgsdfdsfsdfsdfsdfsdfsdfloremloremloremloremloremloremloremloremasdasdsanfkjsdbfhjdbsghjbghjbwefgsdfdsfsdfsdfsdfsdfsdfloremloremloremloremloremloremloremloremasdasdsanfkjsdbfhjdbsghjbghjbwefgsdfdsfsdfsdfsdfsdfsdfloremloremloremloremloremloremloremloremasdasdsanfkjsdbfhjdbsghjbghjbwefgsdfdsfsdfsdfsdfsdfsdfloremloremloremloremloremloremloremloremasdasdsanfkjsdbfhjdbsghjbghjbwefgsdfdsfsdfsdfsdfsdfsdf"
        imageUrl={unknownImage}
        onClick={() => alert('ดูรายการสินค้า')}
      />
    </div>
  );
}
export default Category;
