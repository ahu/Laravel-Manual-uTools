const { shell } = require('electron')

window.exports = {
	'laravel': {
		mode: 'list',
		args: {
			enter: (action, callbackSetList) => {
			},
			search: (action, searchWord, callbackSetList) => {
				if (!searchWord) return callbackSetList()
				searchWord = searchWord.toLowerCase()
				var xmlhttp = new XMLHttpRequest()
				xmlhttp.open('GET', 'https://learnku.com/books/api_search/179/?is_docs=yes&user_id=0&bookid=179&q=' + searchWord, true)
				xmlhttp.send()
				xmlhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						var res = ''
						var arr = new Array()
						res = JSON.parse(this.responseText)
						for(var i in res.results) {
							for (var j in res.results[i].results) {
								res.results[i].results[j]['icon'] = ''
								arr.push(res.results[i].results[j])
							}
						}
						callbackSetList(arr)
					}
				}
			},
			select: (action, itemData) => {
				window.utools.hideMainWindow()
				shell.openExternal(itemData.url).then(() => {
					window.utools.outPlugin()
				})
			}
		}
	}
}