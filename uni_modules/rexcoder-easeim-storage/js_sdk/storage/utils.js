const getSessionId = (
  params = {
    conversationId,
    conversationType
  }
) => {
  return `${params.conversationType}-${params.conversationId}`;
};

// const getRecallConversationUnreadCount = (params: {
// 	conversation: LocalConversation;
// 	isRecallSelfMsg: boolean;
// 	recalledMsgTime: number;
// }) => {
// 	const { isRecallSelfMsg, conversation, recalledMsgTime } = params;
// 	const { unReadCount = 0, unreadCountClearTimestamp = 0 } = conversation;
// 	if (isRecallSelfMsg) {
// 		return unReadCount;
// 	} else {
// 		if (unreadCountClearTimestamp > recalledMsgTime) {
// 			return unReadCount;
// 		} else {
// 			if (unReadCount && unReadCount > 0) {
// 				return unReadCount - 1;
// 			} else {
// 				return 0;
// 			}
// 		}
// 	}
// };

// const hashCode = function (str: string) {
// 	let hash = 0,
// 		i,
// 		chr;
// 	if (str.length === 0) return hash;
// 	for (i = 0; i < str.length; i++) {
// 		chr = str.charCodeAt(i);
// 		hash = (hash << 5) - hash + chr;
// 		hash |= 0; // Convert to 32bit integer
// 	}
// 	return hash;
// };



export { getSessionId };
