import Product from "../models/Task.models.js";


// Create a new product
export const createTaks=async(req,res)=>{
    try{
        const product=await Product.create(req.body);
        res.json({
            message:"Task created succesfully",
            product
        })

    }catch(err){
     res.status(500).json({message:"Server Error",err})
    }
};

// Get all products

export const getAllTask= async(req,res)=>{
    try{
        const products=await Product.find().sort({createdAt:-1});
        res.json(products);

    }catch(err){
      res.status(500).json({message:"Server Error",err})
    }
}



// Get a single product
    export const updateTask=async(req,res)=>{

        try{
            
            const updated=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
             if(!updated){
                return res.status(404).json({ message: "task not found" });
             }
            res.status(201).json({message:"task updated succesfully",updated})

        }catch(err){
            res.status(500).json({message:"Server Error",err})
        }
    }



// Delete Product
export const deleteTask=async(req,res)=>{
    try{
       const deletedProduct=await Product.findByIdAndDelete(req.params.id);
       if(!deletedProduct){
        return res.status(404).json({message:"please selecte the product"})
       }
       res.status(200).json({message:"task was succesfull deleted",deletedProduct})
    }catch(err){
        res.status(500).json({message:"Internal Server Error",err})
    }
}
