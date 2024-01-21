import PostFormSkeleton from '@components/posts/post-form/PostFormSkeleton';
import PostSkeleton from '@components/posts/post/PostSkeleton';
import SuggestionsSkeletons from '@components/suggestions/SuggestionsSkeleton';
import '@pages/social/vibes/Vibes.scss';

const VibesSkeleton = () => {
  return (
    <div className="vibes" data-testid="vibes">
      <div className="vibes-content">
        <div className="vibes-post">
          <PostFormSkeleton />
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index}>
              <PostSkeleton />
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
