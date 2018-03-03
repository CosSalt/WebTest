//1. 定义(路由)组件
//可以import进来
const Foo = {template:'<div>foo component </div>'}
const Bar = {template:'<div>Bar component </div>'}
const Dynamic = {
	template:`
		<div>Dynamic Route component <div>
			this id is {{$route.params.id}}</div>
			<router-view></router-view>
			<router-view name='dynamicChild1'></router-view>
		</div>
	`,
	//beforeRouteUpdate 用来处理组件复用时，根据参数变化进行相应的处理
	beforeRouteUpdate (to, from, next) {
		//alert("use beforeRouteUpdate ing");
		next();
	}
}
const Child = {template:`<div>Child component : I'm Child Route of Dynamic </div>`}
const Child1 = {template:`<div>Child1 了解一下</div>`}

//const ChildEmpty = {template:`<div>I'm emptyChildRouter</div>`}
const ChildEmpty = {
	template:`
		<div>
			child is empty
		</div>
	`
} //template可为空

const DynamicChildrenEmpty = {
	template:`
		<div>
			<div>Dynamic not exist id</div>
			<router-link :to="{name:'Dynamic Route',params:{id:'1111'}}">Go to the Child</router-link>
		</div>
	`
} //template可为空


//2. 定义路由
//每一个路由都应该映射一个组件
//路由可以嵌套
const routes = [
	{path:'/foo', component: Foo, name:'Foo Route'},
	{path:'/bar', component: Bar, name:'Bar Route'},
	{path:'/dynamic', component: DynamicChildrenEmpty, name:'Dynamic no Children Route'},
	// 动态路径参数 以冒号开头
	{path:'/dynamic/:id', component: Dynamic, name:'Dynamic Route',
		children:[
			//path:'';匹配空child的情况
			{
				path: '', component: ChildEmpty
			},
			{
				path:'child',
				component: Child,
				name: 'child'
			},
			{
				path:'child1',
				components: {
					default: Child,
					dynamicChild1: ''
				}
			},
			//重定向
			{
				path:'child3',
				redirect:'child0' //字符串相当于path的作用
			},
			{
				path:'child2',
				redirect:{ 
					name: 'child'
				}
			},
			{
				path:'child4',
				redirect:to => { 
					return {name: 'child'}
				}
			},
			//多视图(命名视图)
			{
				path:'children',
				components: {
					default: Child,
					dynamicChild1: Child1
				}
			}
		]
	}
]

//3. 创建 router 实例，然后传入 `routes` 配置
//还可以传入其它配置参数
const router = new VueRouter({
	routes, // （缩写）相当于 routes: routes
	scrollBehavior(to,from,savedPosition){
		//debugger;

		//return { x: 0, y: 0 }
	},
	linkActiveClass:'router-link-active-test',
	linkExactActiveClass: 'router-link-exact-active-test'
})

//4. 创建和挂载根实例
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app=new Vue({
	router,
	computed:{
		username(){
			//return this.$route.params.username
			return this.$route.params.username
		}
	},
	//复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch（监测变化） $route 对象：
	//或者使用 2.2 中引入的 beforeRouteUpdate 守卫
	//beforeRouteUpdate 比watch $route 先调用
	watch:{
		'$route'(to,from){
			//alert('重复使用组件ing')
		}
	},
	methods:{
		goBack(){
			window.history.length > 1
				? this.$router.go(-1)
				: this.$router.push('/')
		},
		pushUsername(){
			//编程式的导航
			//注意：如果提供了 path，params 会被忽略，需要完整的带有参数的 path
			//同样的规则也适用于 router-link 组件的 to 属性
			//如
			//const userId = 123
			//router.push({ name: 'user', params: { userId }}) // -> /user/123
			//等效于下面的操作
			//router.push({ path: `/user/${userId}` }) // -> /user/123
			this.$router.push({name:'Foo Route',params:{username:'test'}})
		}
	}
}).$mount('#app')

//笔记
//this.$route表示某个具体的路由(当前激活路由对象)
//this.$router表示整个路由(VueRouter实例化的对象(er表示拥有者，router表示route的拥有者))
//要注意，当 <router-link> 对应的路由匹配成功，将自动设置 class 属性值 .router-link-active
//之前没注意router-link-active还是自己写的样式