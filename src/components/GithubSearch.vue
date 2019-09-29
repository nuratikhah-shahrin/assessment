<template>
  <div class="container">
    <div class="row">
      <div class="col-12 active-cyan-4 mt-4 mb-4">
        <input @input="query=$event.target.value" @change="fetchData(1)" class="form-control" type="text" placeholder="Search" aria-label="Search">
      </div>
      <div class="col-12">
        <b v-if="items.items && items.items.length > 0">{{ items.total_count }} repository results</b>
      </div>
      <div class="col" v-if="items.items && items.items.length > 0">
        <div v-for="item in items.items" :key="item.id">
          <hr>
          <div class="row">
            <div class="col-6">
              <p class="fullname">{{ item.full_name }}</p>
              <p>{{ item.description }}</p>
              <p>Updated on {{ item.updated_at | formatDate }}</p>
            </div>
            <div class="col-3">
              <p><i class="fa fa-circle" aria-hidden="true"></i> {{ item.language }}</p>
            </div>
            <div class="col-3">
              <p><i class="fa fa-star" aria-hidden="true"></i> {{ item.stargazers_count }}</p>
            </div>
          </div>
        </div>
          <nav>
            <ul class="pagination justify-content-center">
              <li v-bind:class="[{disabled: !(page_number > 1)}]" class="page-item">
                <a class="page-link" aria-label="Previous" @click="fetchData(page_number > 1 ? page_number - 1 : 1)"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a>
                </li>
              <li class="page-item disabled">
                <a class="page-link">Page {{ page_number }} of {{ total_page }}</a>
              </li>
              <li v-bind:class="[{active: (page == page_number)}]" class="page-item" v-for="page in total_page" v-if="Math.abs(page - page_number) < 3 || page == total_page || page == 1" :key="page">
                <a @click="fetchData(page)"  v-bind:class="[{last: (page == total_page && Math.abs(page - page_number) > 3), first:(page == 1 && Math.abs(page - page_number) > 3)}]" class="page-link">{{ page }}</a>
              </li>
              <li v-bind:class="[{disabled: !(page_number < total_page)}]" class="page-item">
                <a class="page-link" aria-label="Next" @click="fetchData(page_number < total_page ? page_number + 1 : total_page)"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a>
              </li>
            </ul>
          </nav>
      </div>
      <div v-else class="col-12 text-center">
          <h1>
            No results found
          </h1>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'

Vue.filter('formatDate', function(value) {
  if (value) {
    // Tue Jul 03 2018
    return moment(String(value)).format('ddd MMM DD YYYY')
  }
});

export default {
    data: function() {
      return {
        items: [],
        page_number: 1,
        per_page: 10,
        total_page: 0,
        total_count: 0,
        query: ''
      }
    }
    , created(){
        this.fetchData(1);
    }
    , methods: {
      fetchData(page_number) {
        let link = "";
        if(this.query)
          link = 'https://api.github.com/search/repositories?page=' + page_number + '&per_page=' + this.per_page + '&q='+ this.query;

        axios.get(link)
          .then(items=> {
              this.items = items.data
              this.page_number = page_number
              this.total_page = Math.ceil(items.data.total_count / this.per_page)
          })
          .catch(err => console.log(err));
        }
    }
}
</script>

<style>
.fullname {
  font: 700;
  color: blue;
}

a.first::after, a.last::before {
    content: ' ... ';
}

.page-link {
  margin: 5px;
}
</style>
