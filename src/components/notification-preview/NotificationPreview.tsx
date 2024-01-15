import Button from '@components/button/Button';
import '@components/notification-preview/NotificationPreview.scss';

interface INotificationPreview {
  title: string;
  post: any;
  imgUrl: string;
  comment: any;
  reaction: string;
  senderName: string;
  secondButtonText: string;
  secondBtnHandler: () => void;
}
const NotificationPreview: React.FC<INotificationPreview> = ({
  title,
  post,
  imgUrl,
  comment,
  reaction,
  senderName,
  secondButtonText,
  secondBtnHandler
}) => {
  return (
    <>
      <div className="notification-preview-container">
        <div className="dialog">
          <h4>{title}</h4>
          <div className="dialog-body">
            {post && <span className="dialog-body-post">{post}</span>}
            {imgUrl && <img className="dialog-body-img" src={imgUrl} />}
            {comment && <span className="dialog-body-comment">{comment}</span>}
            {reaction && (
              <div className="dialog-body-reaction">
                <span className="dialog-body-reaction-text">{senderName} reacted on your post with</span>{' '}
                <img className="reaction-img" src="" alt="reaction" />
              </div>
            )}
          </div>
          <div className="btn-container">
            <Button className="button cancel-btn" label={secondButtonText} handleClick={secondBtnHandler} disabled={false} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPreview;
