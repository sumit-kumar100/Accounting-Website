import connectDB from '../../backend/database'
import mongoose from 'mongoose'


const handler = async (req, res) => {
  mongoose.connections.forEach(connection => {
    const modelNames = Object.keys(connection.models)

    modelNames.forEach(modelName => {
      delete connection.models[modelName]
    })

    const collectionNames = Object.keys(connection.collections)
    collectionNames.forEach(collectionName => {
      delete connection.collections[collectionName]
    })
  })

  //   const modelSchemaNames = Object.keys(mongoose.modelSchemas)
  //   modelSchemaNames.forEach(modelSchemaName => {
  //     delete mongoose.modelSchemas[modelSchemaName]
  //   })
  
  res.status(200).json({ message: 'Schema Update Successfully' })
}


export default connectDB(handler)