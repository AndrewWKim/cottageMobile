import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
    item: {
        color: '#202020',
    },
    touchableItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#202020',
        borderBottomWidth: 0.5,
        paddingHorizontal: 25,
        paddingVertical: 10,
    },
    date: {
        fontSize: 13,
        lineHeight: 13,
        color: '#202020',
        marginVertical: 5,
    },
    dot: {
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 14,
        lineHeight: 18,
        marginVertical: 10,
    },
    heading: {
        fontSize: 20,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 20,
    },
    voteCount: {
        marginLeft: 6,
        fontSize: 11,
        lineHeight: 11,
        color: '#202020',
    },
    countBlock: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    comments: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentsTitle: {
        marginLeft: 5,
        fontSize: 11,
        color: '#202020',
    },
    row: {
        marginTop: 5,
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    spacer: {
        flex: 6,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    voteButton: {
        flex: 4,
        height: 50,
        width: 90,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inFavour: {
        backgroundColor: '#AED5A1',
    },
    against: {
        backgroundColor: '#F15252',
    },
    abstention: {
        backgroundColor: '#D3D983',
    },
    buttonSpacer: {
        flex: 1,
    },
    alreadyVoted: {
        fontSize: 20,
        padding: 10,
        textAlign: 'center',
        lineHeight: 25,
        fontWeight: 'bold'
    },
})
export default styles
