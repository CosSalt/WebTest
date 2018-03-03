const store = new Vuex.Store({
	state:{
		count:0
	},
	mutations:{
		increment(state){
			//debugger;
			console.log(store.state.count);
			state.count++;
		}
	}
})