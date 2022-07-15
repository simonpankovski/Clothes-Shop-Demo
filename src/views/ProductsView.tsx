import { client, DataType, Query } from '@tilework/opus';
import React, { Component } from 'react'

export default class ProductsView extends Component {
    async fetchProductsPerCategory() {
        const query = new Query("categories", true).addField("name");
        let result: DataType<typeof query>;
        client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT || "");
        result = await client.post(query);
        return result;
      }
    render() {
        return (
            <div>ProductsView</div>
        )
    }
}
