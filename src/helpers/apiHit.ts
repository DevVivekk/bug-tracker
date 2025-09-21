interface apiInterface{
    method:string,
    data?:Record<string,string | Date>, //handling case when createdAt and updatedAt is sent but its not related to the updation
    path:string
}


const callApi = async({method,data={},path}:apiInterface)=>{
    const obj:RequestInit= {
        method,
        headers:{
            "accept":"application/json",
            "Content-Type":"application/json"
        },
    }
     // Only include body for non-GET methods
  if (method !== "GET") {
    obj.body = JSON.stringify(data);
  }
    const res = await fetch(`${path}`,obj)
    const ans = await res.json();
    return ans;
}
export default callApi;