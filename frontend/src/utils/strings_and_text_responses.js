function toTitleCase (str) {
  str = str.toLowerCase()
           .split(' ')
           .map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
});
 return str.join(' ');
}


export default toTitleCase;