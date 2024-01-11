import SuggestionsSkeletons from '@components/suggestions/SuggestionsSkeleton';
import '@pages/social/vibes/Vibes.scss';

const VibesSkeleton = () => {
  return (
    <div className="vibes" data-testid="vibes">
      <div className="vibes-content">
        <div className="vibes-post">
          <div>Post skeleton</div>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index}>
              <div>Post Skeleton</div>
            </div>
          ))}
        </div>
        <div className="vibes-suggestions">
          <SuggestionsSkeletons />
        </div>
      </div>
    </div>
  );
};

export default VibesSkeleton;
