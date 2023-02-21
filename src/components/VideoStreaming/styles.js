export default styles = {
    scrollView: {
    },
    scrollViewContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 30,
    },
    currentVideo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    navButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        borderBottomColor: '#828282',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 17
    },
    selectedButton: {
        flex: 1,
        borderBottomColor: '#202020',
        borderBottomWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 17,
        paddingBottom: 14
    },
    buttonText: {
        color: '#828282',
        fontWeight: 'normal',
        fontSize: 16,
    },
    selectedButtonText: {
        color: '#202020',
        fontWeight: 'bold',
        fontSize: 16,
    },
    playerWrapper: {
        backgroundColor: 'rgba(0,0,0,0.1)', 
        position: 'relative',
    },
    streamLoader: {
        position: 'absolute',
        left: '40%',
        top: '40%',
    },
    streamLoaderBig: {
        position: 'absolute',
        left: '47%',
        top: '47%',
    }
}
