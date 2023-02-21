export default stringToDate = string => {
    const a = string.split(/[^0-9]/).map(item => parseInt(item, 10))
    return new Date(
        a[2] || 1,
        a[1] - 1 || 0,
        a[0],
        a[3] || 0,
        a[4] || 0,
        a[5] || 0,
    )
}
